const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .populate('hospitalId', 'name address')
      .select('-password');
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Create user (head of doctors)
router.post('/', auth, [
  body('username').trim().notEmpty().withMessage('اسم المستخدم مطلوب'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('fullName').trim().notEmpty().withMessage('الاسم الكامل مطلوب'),
  body('phone').trim().notEmpty().withMessage('رقم الهاتف مطلوب'),
  body('hospitalId').trim().notEmpty().withMessage('المستشفى مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    }

    // Check if user has permission (only chief_of_doctors)
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإضافة مستخدم' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
    }

    // Check if hospital already has a head
    const existingHead = await User.findOne({ 
      hospitalId: req.body.hospitalId,
      role: 'head_of_doctors',
      isActive: true 
    });
    if (existingHead) {
      return res.status(400).json({ message: 'هذا المستشفى له رئيس أطباء بالفعل' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      fullName: req.body.fullName,
      phone: req.body.phone,
      jobTitle: req.body.jobTitle || 'رئيس أطباء',
      hospitalId: req.body.hospitalId,
      role: 'head_of_doctors',
      isActive: true
    });

    await user.save();

    // Return user without password
    const userResponse = await User.findById(user._id)
      .populate('hospitalId', 'name address')
      .select('-password');
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Update user
router.put('/:id', auth, [
  body('username').optional().trim().notEmpty().withMessage('اسم المستخدم مطلوب'),
  body('password').optional().isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  body('fullName').optional().trim().notEmpty().withMessage('الاسم الكامل مطلوب'),
  body('phone').optional().trim().notEmpty().withMessage('رقم الهاتف مطلوب')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has permission
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل المستخدم' });
    }

    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('hospitalId', 'name address')
    .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

// Delete user (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role !== 'chief_of_doctors') {
      return res.status(403).json({ message: 'ليس لديك صلاحية لحذف المستخدم' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json({ message: 'تم حذف المستخدم بنجاح', user });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;
