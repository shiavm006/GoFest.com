import express from "express";
import Fest from "../models/Fest.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { skip = 0, limit = 20, category } = req.query;
    
    const query = {};
    if (category) {
      query.category = category;
    }
    
    const fests = await Fest.find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    res.json(fests);
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const fest = await Fest.findOne({ slug });
    
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

router.post("/", async (req, res, next) => {
  try {
    const fest = new Fest(req.body);
    await fest.save();
    res.status(201).json(fest);
  } catch (error) {
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

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const fest = await Fest.findByIdAndDelete(id);
    
    if (!fest) {
      return res.status(404).json({
        detail: "Fest not found"
      });
    }
    
    res.json({ message: "Fest deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;

