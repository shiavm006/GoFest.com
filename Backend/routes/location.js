import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Rate limiting map (simple in-memory, use Redis in real production)
const rateLimitMap = new Map();

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.timestamp < oneHourAgo) {
      rateLimitMap.delete(key);
    }
  }
}, 3600000);

// Rate limiter middleware
const locationRateLimit = (req, res, next) => {
  const identifier = req.user?._id || req.ip;
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (userLimit) {
    const timeSinceLastRequest = now - userLimit.timestamp;
    
    // Allow 1 request per 2 seconds per user
    if (timeSinceLastRequest < 2000) {
      return res.status(429).json({
        detail: "Too many requests. Please wait a moment."
      });
    }
  }

  rateLimitMap.set(identifier, { timestamp: now });
  next();
};

// Reverse geocode endpoint (proxies to Nominatim with caching)
router.get("/reverse-geocode", authenticate, locationRateLimit, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ detail: "Latitude and longitude are required" });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude) || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return res.status(400).json({ detail: "Invalid coordinates" });
    }

    // Call Nominatim API with proper headers and error handling
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GoFest.com College Fest Platform',
          'Accept-Language': 'en'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API returned ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.address) {
      return res.status(404).json({ 
        detail: "Could not find address for these coordinates" 
      });
    }

    // Return structured, clean data
    res.json({
      location: {
        city: data.address.city || 
              data.address.town || 
              data.address.village || 
              data.address.municipality || "",
        state: data.address.state || data.address.region || "",
        country: data.address.country || "India",
        postcode: data.address.postcode || "",
        formatted: data.display_name || ""
      },
      coordinates: {
        latitude,
        longitude
      }
    });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        detail: "Location service timeout. Please try again." 
      });
    }
    
    console.error("Reverse geocode error:", error);
    res.status(500).json({ 
      detail: "Failed to fetch location details. Please enter manually." 
    });
  }
});

// Search location by name (for autocomplete - future feature)
router.get("/search", authenticate, locationRateLimit, async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({ 
        detail: "Search query must be at least 3 characters" 
      });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GoFest.com College Fest Platform',
          'Accept-Language': 'en'
        },
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API returned ${response.status}`);
    }

    const data = await response.json();

    const results = data.map(item => ({
      name: item.display_name,
      city: item.address.city || item.address.town || item.address.village || "",
      state: item.address.state || "",
      country: item.address.country || "",
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }
    }));

    res.json({ results });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        detail: "Location search timeout. Please try again." 
      });
    }
    
    console.error("Location search error:", error);
    res.status(500).json({ 
      detail: "Failed to search locations." 
    });
  }
});

export default router;

