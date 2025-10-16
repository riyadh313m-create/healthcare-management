const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      'user_login',
      'user_logout', 
      'doctor_added',
      'doctor_updated',
      'doctor_archived',
      'hospital_added',
      'hospital_updated',
      'transfer_requested',
      'transfer_approved',
      'transfer_rejected',
      'notification_sent'
    ],
    required: true
  },
  performedBy: {
    type: String,
    required: true
  },
  performedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetId: {
    type: String,
    required: true
  },
  targetType: {
    type: String,
    enum: ['doctor', 'hospital', 'transfer', 'user', 'notification'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

// Index for performance
historySchema.index({ timestamp: -1 });
historySchema.index({ performedById: 1, timestamp: -1 });
historySchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('History', historySchema);