import express from "express";
import Fest from "../models/Fest.js";
import Registration from "../models/Registration.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { skip = 0, limit = 20, category, search } = req.query;
    
    const query = { status: 'published' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const fests = await Fest.find(query)
      .populate('hostedBy', 'name email')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Fest.countDocuments(query);
    
    res.json({
      fests,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const fest = await Fest.findOne({ slug })
      .populate('hostedBy', 'name email college');
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    res.json(fest);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const festData = {
      ...req.body,
      hostedBy: req.user._id
    };
    
    if (!festData.slug) {
      festData.slug = festData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const existingFest = await Fest.findOne({ slug: festData.slug });
    if (existingFest) {
      festData.slug = `${festData.slug}-${Date.now()}`;
    }
    
    const fest = new Fest(festData);
    await fest.save();
    
    const populatedFest = await Fest.findById(fest._id)
      .populate('hostedBy', 'name email');
    
    res.status(201).json(populatedFest);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        detail: "A fest with this slug already exists"
      });
    }
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const fest = await Fest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    res.json(fest);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const fest = await Fest.findById(id);
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    if (fest.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        detail: "You don't have permission to delete this fest"
      });
    }
    
    await Fest.findByIdAndDelete(id);
    await Registration.deleteMany({ fest: id });
    
    res.json({ message: "Fest deleted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/user/my-fests", authenticate, async (req, res, next) => {
  try {
    const fests = await Fest.find({ hostedBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(fests);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/register", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { registeredEvents } = req.body;
    
    const fest = await Fest.findById(id);
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    if (fest.status !== 'published') {
      return res.status(400).json({
        detail: "This fest is not open for registration"
      });
    }
    
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      fest: id
    });
    
    if (existingRegistration) {
      return res.status(400).json({
        detail: "You are already registered for this fest"
      });
    }
    
    const paymentAmount = fest.entryType === 'Paid' ? fest.entryFee : 0;
    const paymentStatus = fest.entryType === 'Paid' ? 'pending' : 'not_required';
    
    const registration = new Registration({
      user: req.user._id,
      fest: id,
      registeredEvents: registeredEvents || [],
      paymentAmount,
      paymentStatus
    });
    
    await registration.save();
    
    fest.registrationsCount += 1;
    await fest.save();
    
    const populatedRegistration = await Registration.findById(registration._id)
      .populate('fest', 'title college date location image')
      .populate('user', 'name email');
    
    res.status(201).json(populatedRegistration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        detail: "You are already registered for this fest"
      });
    }
    next(error);
  }
});

router.get("/:id/registrations", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const fest = await Fest.findById(id);
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    if (fest.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        detail: "You don't have permission to view registrations"
      });
    }
    
    const registrations = await Registration.find({ fest: id })
      .populate('user', 'name email college')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    next(error);
  }
});

export default router;

