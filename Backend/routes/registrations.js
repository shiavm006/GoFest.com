import express from "express";
import Registration from "../models/Registration.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/my-registrations", authenticate, async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('fest', 'title college date location image category entryType registrationsCount')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const registration = await Registration.findById(id)
      .populate('fest')
      .populate('user', 'name email college');
    
    if (!registration) {
      return res.status(404).json({
        detail: "Registration not found"
      });
    }
    
    if (registration.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        detail: "You don't have permission to view this registration"
      });
    }
    
    res.json(registration);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/cancel", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const registration = await Registration.findById(id);
    
    if (!registration) {
      return res.status(404).json({
        detail: "Registration not found"
      });
    }
    
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        detail: "You don't have permission to cancel this registration"
      });
    }
    
    if (registration.status === 'cancelled') {
      return res.status(400).json({
        detail: "Registration is already cancelled"
      });
    }
    
    registration.status = 'cancelled';
    await registration.save();
    
    const Fest = (await import("../models/Fest.js")).default;
    await Fest.findByIdAndUpdate(registration.fest, {
      $inc: { registrationsCount: -1 }
    });
    
    const populatedRegistration = await Registration.findById(registration._id)
      .populate('fest', 'title college date')
      .populate('user', 'name email');
    
    res.json(populatedRegistration);
  } catch (error) {
    next(error);
  }
});

export default router;

