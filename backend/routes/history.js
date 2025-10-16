const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Get history records
router.get('/', auth, async (req, res) => {
  try {
    const { 
      action, 
      targetType, 
      targetId, 
      performedById,
      startDate, 
      endDate,
      limit = 50, 
      page = 1 
    } = req.query;
    
    let filter = {};
    
    if (action) filter.action = action;
    if (targetType) filter.targetType = targetType;
    if (targetId) filter.targetId = targetId;
    if (performedById) filter.performedById = performedById;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const history = await History.find(filter)
      .populate('performedById', 'fullName')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await History.countDocuments(filter);

    res.json({
      history,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create history record
router.post('/', auth, async (req, res) => {
  try {
    const historyRecord = new History({
      ...req.body,
      performedById: req.user._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await historyRecord.save();

    const populatedRecord = await History.findById(historyRecord._id)
      .populate('performedById', 'fullName');

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Create history error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Get statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchFilter = {};
    if (startDate || endDate) {
      matchFilter.timestamp = {};
      if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
      if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
    }

    const stats = await History.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastPerformed: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalRecords = await History.countDocuments(matchFilter);

    res.json({
      stats,
      totalRecords
    });
  } catch (error) {
    console.error('Get history stats error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;