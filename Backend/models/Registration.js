import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fest',
    required: true
  },
  registeredEvents: [{
    type: String,
    default: []
  }],
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled'],
    default: 'registered'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'not_required'],
    default: 'not_required'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

registrationSchema.index({ user: 1, fest: 1 }, { unique: true });
registrationSchema.index({ fest: 1 });
registrationSchema.index({ user: 1 });
registrationSchema.index({ createdAt: -1 });

export default mongoose.model("Registration", registrationSchema);

