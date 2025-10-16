const express = require('express');
const { body, validationResult } = require('express-validator');
const Hospital = require('../models/Hospital');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true });
    res.json(hospitals);
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'المستشفى غير موجود' });
    }
    res.json(hospital);
  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create hospital
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('اسم المستشفى مطلوب'),
  body('type').isIn(['hospital', 'health_center']).withMessage('نوع المنشأة غير صالح'),
  body('requiredDoctors').isInt({ min: 1 }).withMessage('عدد الأطباء المطلوب يجب أن يكون رقماً موجباً')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission (only chief_of_doctors)
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإضافة مستشفى' });
    }

    const hospital = new Hospital(req.body);
    await hospital.save();
    
    res.status(201).json(hospital);
  } catch (error) {
    console.error('Create hospital error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Update hospital
router.put('/:id', auth, [
  body('name').optional().trim().notEmpty().withMessage('اسم المستشفى مطلوب'),
  body('type').optional().isIn(['hospital', 'health_center']).withMessage('نوع المنشأة غير صالح'),
  body('requiredDoctors').optional().isInt({ min: 1 }).withMessage('عدد الأطباء المطلوب يجب أن يكون رقماً موجباً')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل مستشفى' });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'المستشفى غير موجود' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Update hospital error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Delete hospital (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لحذف مستشفى' });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ message: 'المستشفى غير موجود' });
    }

    res.json({ message: 'تم حذف المستشفى بنجاح' });
  } catch (error) {
    console.error('Delete hospital error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;