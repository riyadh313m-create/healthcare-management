const express = require('express');
const { body, validationResult } = require('express-validator');
const Transfer = require('../models/Transfer');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transfers (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { status, doctorId, hospitalId } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (hospitalId) {
      filter.$or = [
        { fromHospitalId: hospitalId },
        { toHospitalId: hospitalId }
      ];
    }

    // If user is head_of_doctors, only show transfers related to their hospital
    if (req.user.role === 'head_of_doctors' && req.user.hospitalId) {
      filter.$or = [
        { fromHospitalId: req.user.hospitalId },
        { toHospitalId: req.user.hospitalId }
      ];
    }

    const transfers = await Transfer.find(filter)
      .populate('doctorId', 'fullName specialization')
      .populate('fromHospitalId', 'name')
      .populate('toHospitalId', 'name')
      .populate('requestedBy', 'fullName')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create transfer request
router.post('/', auth, [
  body('doctorId').isMongoId().withMessage('معرف الطبيب غير صالح'),
  body('fromHospitalId').isMongoId().withMessage('معرف المستشفى المصدر غير صالح'),
  body('toHospitalId').isMongoId().withMessage('معرف المستشفى الوجهة غير صالح'),
  body('reason').trim().notEmpty().withMessage('سبب النقل مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, fromHospitalId, toHospitalId, reason } = req.body;

    // Verify doctor and hospitals exist
    const doctor = await Doctor.findById(doctorId);
    const fromHospital = await Hospital.findById(fromHospitalId);
    const toHospital = await Hospital.findById(toHospitalId);

    if (!doctor || !fromHospital || !toHospital) {
      return res.status(400).json({ message: 'بيانات غير صالحة' });
    }

    // Check if doctor is currently in the source hospital
    console.log('Doctor current hospital:', doctor.currentHospital.toString());
    console.log('From hospital ID:', fromHospitalId);
    if (doctor.currentHospital.toString() !== fromHospitalId.toString()) {
      return res.status(400).json({ 
        message: 'الطبيب غير موجود في المستشفى المصدر',
        doctorHospital: doctor.currentHospital.toString(),
        fromHospital: fromHospitalId.toString()
      });
    }

    const transfer = new Transfer({
      doctorId,
      fromHospitalId,
      toHospitalId,
      reason,
      requestedBy: req.user._id
    });

    await transfer.save();

    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate('doctorId', 'fullName specialization')
      .populate('fromHospitalId', 'name')
      .populate('toHospitalId', 'name')
      .populate('requestedBy', 'fullName');

    // إنشاء إشعار لرئيس الأطباء العموم عند طلب نقل جديد
    try {
      const notification = new Notification({
        type: 'transfer_request',
        title: 'طلب نقل جديد',
        message: `طلب نقل الطبيب ${doctor.fullName} من ${fromHospital.name} إلى ${toHospital.name}`,
        recipientId: null, // رئيس الأطباء العموم
        isRead: false,
        relatedId: transfer._id,
        createdAt: new Date()
      });
      await notification.save();
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.status(201).json(populatedTransfer);
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Approve/Reject transfer
router.patch('/:id/status', auth, [
  body('status').isIn(['approved', 'rejected']).withMessage('حالة غير صالحة'),
  body('rejectionReason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Only chief_of_doctors can approve/reject transfers
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لاتخاذ قرار بشأن النقل' });
    }

    const { status, rejectionReason } = req.body;
    
    const updateData = {
      status,
      approvedBy: req.user._id,
      approvalDate: new Date()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (status === 'approved') {
      updateData.effectiveDate = new Date();
    }

    const transfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('doctorId', 'fullName specialization')
     .populate('fromHospitalId', 'name')
     .populate('toHospitalId', 'name');

    if (!transfer) {
      return res.status(404).json({ message: 'طلب النقل غير موجود' });
    }

    // If approved, update doctor's current hospital
    if (status === 'approved') {
      await Doctor.findByIdAndUpdate(
        transfer.doctorId._id,
        { currentHospital: transfer.toHospitalId }
      );

      // Update hospital doctor counts
      await Hospital.findByIdAndUpdate(
        transfer.fromHospitalId,
        { $inc: { currentDoctors: -1 } }
      );
      await Hospital.findByIdAndUpdate(
        transfer.toHospitalId,
        { $inc: { currentDoctors: 1 } }
      );
    }

    res.json(transfer);
  } catch (error) {
    console.error('Update transfer status error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;