const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['transfer_request', 'transfer_approved', 'transfer_rejected', 'doctor_added', 'hospital_added', 'info'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipientId: {
    type: String, // يمكن أن يكون ObjectId أو 'chief_of_doctors' أو 'all'
    default: 'all'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  relatedEntityType: {
    type: String,
    enum: ['Doctor', 'Hospital', 'Transfer', 'User']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update readAt when isRead is set to true
notificationSchema.pre('save', function(next) {
  if (this.isRead && !this.readAt) {
    this.readAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);