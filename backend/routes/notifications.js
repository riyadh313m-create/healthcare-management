const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const { isRead, limit = 20, page = 1 } = req.query;
    
    let filter = {};
    
    // Filter by recipient (if specified) or show all for chief_of_doctors
    if (req.user.role === 'head_of_doctors') {
      filter.recipientId = req.user._id;
    } else if (req.query.recipientId) {
      filter.recipientId = req.query.recipientId;
    }
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(filter)
      .populate('recipientId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(filter);

    res.json({
      notifications,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create notification
router.post('/', auth, async (req, res) => {
  try {
    // Only chief_of_doctors can create notifications
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإنشاء إشعار' });
    }

    const notification = new Notification(req.body);
    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('recipientId', 'fullName');

    res.status(201).json(populatedNotification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'الإشعار غير موجود' });
    }

    // Check if user has permission to read this notification
    if (req.user.role === 'head_of_doctors' && 
        notification.recipientId && 
        notification.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ليس لديك صلاحية لقراءة هذا الإشعار' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'الإشعار غير موجود' });
    }

    // Check permissions
    if (req.user.role === 'head_of_doctors' && 
        notification.recipientId && 
        notification.recipientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ليس لديك صلاحية لحذف هذا الإشعار' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الإشعار بنجاح' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Get unread count
router.get('/unread/count', auth, async (req, res) => {
  try {
    let filter = { isRead: false };
    
    if (req.user.role === 'head_of_doctors') {
      filter.recipientId = req.user._id;
    }

    const count = await Notification.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;