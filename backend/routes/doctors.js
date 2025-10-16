const express = require('express');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all doctors (with filters)
router.get('/', async (req, res) => {
  try {
    const { hospitalId, specialization, status, isArchived } = req.query;
    
    let filter = {};
    if (hospitalId) filter.currentHospital = hospitalId;
    if (specialization) filter.specialization = specialization;
    if (status) filter.status = status;
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';

    const doctors = await Doctor.find(filter)
      .populate('originalHospital', 'name')
      .populate('currentHospital', 'name')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('originalHospital', 'name')
      .populate('currentHospital', 'name');
      
    if (!doctor) {
      return res.status(404).json({ message: 'الطبيب غير موجود' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create doctor
router.post('/', auth, [
  body('fullName').trim().notEmpty().withMessage('اسم الطبيب مطلوب'),
  body('jobTitle').isIn(['اخصائي', 'مقيم اقدم', 'تدرج', 'مقيم دوري', 'طبيب عام', 'طبيب اختصاص', 'طبيب استشاري', 'طبيب مقيم', 'رئيس أطباء', 'نائب رئيس أطباء']).withMessage('العنوان الوظيفي غير صالح'),
  body('graduationYear').isInt({ min: 1980, max: new Date().getFullYear() }).withMessage('سنة التخرج غير صالحة'),
  body('specialization').trim().notEmpty().withMessage('التخصص مطلوب'),
  body('gender').isIn(['male', 'female']).withMessage('الجنس غير صالح'),
  body('originalHospital').trim().notEmpty().withMessage('المستشفى الأصلي مطلوب'),
  body('currentHospital').trim().notEmpty().withMessage('المستشفى الحالي مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    // Check if user has permission - both roles can add doctors
    if (req.user.role !== 'chief_of_doctors' && req.user.role !== 'head_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإضافة طبيب' });
    }
    
    // If head_of_doctors, ensure they can only add to their hospital
    if (req.user.role === 'head_of_doctors' && req.user.hospitalId) {
      if (req.body.currentHospital !== req.user.hospitalId.toString() && 
          req.body.originalHospital !== req.user.hospitalId.toString()) {
        return res.status(403).json({ message: 'يمكنك إضافة أطباء لمستشفاك فقط' });
      }
    }

    // Verify hospitals exist
    const originalHospital = await Hospital.findById(req.body.originalHospital);
    const currentHospital = await Hospital.findById(req.body.currentHospital);
    
    if (!originalHospital || !currentHospital) {
      return res.status(400).json({ message: 'المستشفى المحدد غير موجود' });
    }

    const doctor = new Doctor({
      ...req.body,
      startDate: req.body.startDate || new Date()
    });

    await doctor.save();
    
    // Update hospital doctor count
    await Hospital.findByIdAndUpdate(
      req.body.currentHospital,
      { $inc: { currentDoctors: 1 } }
    );

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('originalHospital', 'name')
      .populate('currentHospital', 'name');
    
    res.status(201).json(populatedDoctor);
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Update doctor
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission - both roles can edit doctors
    if (req.user.role !== 'chief_of_doctors' && req.user.role !== 'head_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل بيانات الطبيب' });
    }
    
    // If head_of_doctors, ensure they can only edit doctors in their hospital
    if (req.user.role === 'head_of_doctors' && req.user.hospitalId) {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ message: 'الطبيب غير موجود' });
      }
      if (doctor.currentHospital.toString() !== req.user.hospitalId.toString()) {
        return res.status(403).json({ message: 'يمكنك تعديل أطباء مستشفاك فقط' });
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('originalHospital', 'name')
     .populate('currentHospital', 'name');

    if (!doctor) {
      return res.status(404).json({ message: 'الطبيب غير موجود' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Archive doctor
router.patch('/:id/archive', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لأرشفة الطبيب' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { 
        isArchived: true,
        archivedAt: new Date()
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'الطبيب غير موجود' });
    }

    // Update hospital doctor count
    await Hospital.findByIdAndUpdate(
      doctor.currentHospital,
      { $inc: { currentDoctors: -1 } }
    );

    res.json({ message: 'تم أرشفة الطبيب بنجاح' });
  } catch (error) {
    console.error('Archive doctor error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;