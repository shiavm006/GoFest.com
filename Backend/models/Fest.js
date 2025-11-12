import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, default: null },
  coordinates: { type: [Number], default: null }
}, { _id: false });

const organizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  college: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  instagram: { type: String, default: null },
  linkedin: { type: String, default: null }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true },
  prize: { type: String, default: null },
  limit: { type: String, default: null }
}, { _id: false });

const festSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    default: null
  },
  college: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: null
  },
  location: {
    type: locationSchema,
    required: true
  },
  organizer: {
    type: organizerSchema,
    required: true
  },
  entryType: {
    type: String,
    default: "Free"
  },
  entryFee: {
    type: Number,
    default: 0
  },
  expectedFootfall: {
    type: String,
    default: null
  },
  website: {
    type: String,
    default: null
  },
  brochure: {
    type: String,
    default: null
  },
  events: {
    type: [eventSchema],
    default: []
  },
  hostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  }
}, {
  timestamps: true
});

festSchema.index({ slug: 1 }, { unique: true });
festSchema.index({ category: 1 });
festSchema.index({ createdAt: -1 });

export default mongoose.model("Fest", festSchema);

