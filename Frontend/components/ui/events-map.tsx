"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Fest } from "@/lib/api";
import { API_BASE_URL } from "@/lib/api";

// Fix for default marker icons in Next.js
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EventsMapProps {
  fests: Fest[];
  selectedFest: Fest | null;
  onFestClick: (fest: Fest) => void;
}

// Component to handle map view updates when selectedFest changes
function MapController({ selectedFest }: { selectedFest: Fest | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedFest?.location?.coordinates && selectedFest.location.coordinates.length === 2) {
      const [lng, lat] = selectedFest.location.coordinates;
      map.setView([lat, lng], 13, { animate: true, duration: 0.5 });
    }
  }, [selectedFest, map]);

  return null;
}

// Geocoding cache to avoid repeated API calls
const geocodeCache = new Map<string, [number, number]>();

// Geocode address to coordinates
async function geocodeAddress(fest: Fest): Promise<[number, number] | null> {
  if (!fest.location?.city || !fest.location?.state) return null;

  // Create cache key
  const cacheKey = `${fest.location.city}, ${fest.location.state}, India`;
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    // Try backend API first (if available)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      try {
        const address = `${fest.location.address || ''}, ${fest.location.city}, ${fest.location.state}, India`.trim();
        const response = await fetch(
          `${API_BASE_URL}/api/location/geocode?address=${encodeURIComponent(address)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.location?.coordinates && data.location.coordinates.length === 2) {
            const coords: [number, number] = data.location.coordinates;
            geocodeCache.set(cacheKey, coords);
            return coords;
          }
        }
      } catch (error) {
        // Fall back to Nominatim if backend fails
        console.log('Backend geocoding failed, using Nominatim');
      }
    }

    // Fallback to Nominatim (OpenStreetMap geocoding)
    const address = `${fest.location.city}, ${fest.location.state}, India`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=in`,
      {
        headers: {
          'User-Agent': 'GoFest.com College Fest Platform',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data && data.length > 0) {
      const [lng, lat] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      const coords: [number, number] = [lng, lat];
      geocodeCache.set(cacheKey, coords);
      return coords;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}

export default function EventsMap({ fests, selectedFest, onFestClick }: EventsMapProps) {
  const [mounted, setMounted] = useState(false);
  const [festsWithCoords, setFestsWithCoords] = useState<Fest[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Process fests and geocode if needed
  useEffect(() => {
    const processFests = async () => {
      if (fests.length === 0) {
        setFestsWithCoords([]);
        return;
      }

      setIsGeocoding(true);
      const processed: Fest[] = [];
      let needsGeocoding = 0;

      // First pass: collect fests with coordinates and identify those needing geocoding
      const festsToGeocode: Fest[] = [];
      
      for (const fest of fests) {
        if (
          fest.location?.coordinates &&
          fest.location.coordinates.length === 2 &&
          fest.location.coordinates[0] !== 0 &&
          fest.location.coordinates[1] !== 0
        ) {
          // Fest already has valid coordinates
          processed.push(fest);
        } else if (fest.location?.city && fest.location?.state) {
          // Fest needs geocoding
          festsToGeocode.push(fest);
          needsGeocoding++;
        }
      }

      setGeocodingProgress({ current: 0, total: needsGeocoding });

      // Second pass: geocode fests that need it
      for (let i = 0; i < festsToGeocode.length; i++) {
        const fest = festsToGeocode[i];
        const coords = await geocodeAddress(fest);
        
        setGeocodingProgress({ current: i + 1, total: needsGeocoding });
        
        if (coords) {
          processed.push({
            ...fest,
            location: {
              ...fest.location,
              coordinates: coords,
            },
          });
        }
        
        // Small delay to avoid rate limiting
        if (i < festsToGeocode.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log(`Map: ${processed.length} of ${fests.length} fests have coordinates`);
      setFestsWithCoords(processed);
      setIsGeocoding(false);
    };

    processFests();
  }, [fests]);

  // Default center (New Delhi) if no fests with coordinates
  const defaultCenter: [number, number] = [28.6139, 77.2090];
  
  // Calculate center based on fests if available
  const getCenter = (): [number, number] => {
    if (festsWithCoords.length === 0) return defaultCenter;
    
    const avgLat =
      festsWithCoords.reduce((sum, fest) => sum + (fest.location?.coordinates?.[1] || 0), 0) /
      festsWithCoords.length;
    const avgLng =
      festsWithCoords.reduce((sum, fest) => sum + (fest.location?.coordinates?.[0] || 0), 0) /
      festsWithCoords.length;
    
    return [avgLat, avgLng];
  };

  if (!mounted) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (isGeocoding && festsWithCoords.length === 0) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
        <p className="text-gray-600 mb-2">Loading fest locations...</p>
        {geocodingProgress.total > 0 && (
          <p className="text-xs text-gray-500">
            {geocodingProgress.current} / {geocodingProgress.total}
          </p>
        )}
      </div>
    );
  }

  if (festsWithCoords.length === 0 && fests.length > 0) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2 text-sm">No fest locations available</p>
          <p className="text-xs text-gray-500">
            Fests need location data to show on map.<br />
            Use "Use Current Location" when creating fests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={getCenter()}
        zoom={festsWithCoords.length > 0 ? 10 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedFest={selectedFest} />

        {festsWithCoords.map((fest) => {
          const [lng, lat] = fest.location!.coordinates!;
          const isSelected = selectedFest?._id === fest._id;

          return (
            <Marker
              key={fest._id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => {
                  onFestClick(fest);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{fest.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{fest.college}</p>
                  <p className="text-xs text-gray-500">
                    {fest.location?.city}, {fest.location?.state}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{fest.date}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

