const { body, param, validationResult } = require('express-validator');

// ===================================
// Middleware للتحقق من صحة المدخلات
// ===================================

// معالج الأخطاء من validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'بيانات غير صحيحة',
      errors: errors.array() 
    });
  }
  next();
};

// ===================================
// قواعد التحقق من صحة البيانات
// ===================================

// التحقق من بيانات تسجيل الدخول
const validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .notEmpty().withMessage('كلمة المرور مطلوبة'),
  handleValidationErrors
];

// التحقق من بيانات التسجيل
const validateRegister = [
  body('fullName')
    .trim()
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/).withMessage('الاسم يجب أن يحتوي على حروف فقط')
    .notEmpty().withMessage('الاسم الكامل مطلوب'),
  body('email')
    .trim()
    .isEmail().withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم')
    .notEmpty().withMessage('كلمة المرور مطلوبة'),
  body('role')
    .isIn(['admin', 'health_directorate', 'chief_of_doctors']).withMessage('الدور غير صحيح'),
  handleValidationErrors
];

// التحقق من بيانات إضافة طبيب
const validateDoctor = [
  body('fullName')
    .trim()
    .isLength({ min: 3 }).withMessage('الاسم يجب أن يكون 3 أحرف على الأقل')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/).withMessage('الاسم يجب أن يحتوي على حروف فقط')
    .notEmpty().withMessage('الاسم الكامل مطلوب'),
  body('specialization')
    .trim()
    .notEmpty().withMessage('التخصص مطلوب'),
  body('jobTitle')
    .trim()
    .notEmpty().withMessage('المسمى الوظيفي مطلوب'),
  body('currentHospital')
    .trim()
    .notEmpty().withMessage('المستشفى الحالي مطلوب'),
  body('status')
    .isIn(['مستمر بالدوام', 'اجازة مرضية', 'اجازة امومة', 'اجازة طويلة']).withMessage('الحالة غير صحيحة'),
  handleValidationErrors
];

// التحقق من بيانات المستشفى
const validateHospital = [
  body('name')
    .trim()
    .isLength({ min: 3 }).withMessage('اسم المستشفى يجب أن يكون 3 أحرف على الأقل')
    .notEmpty().withMessage('اسم المستشفى مطلوب'),
  body('location')
    .trim()
    .notEmpty().withMessage('الموقع مطلوب'),
  body('headOfDoctors')
    .optional()
    .trim()
    .isMongoId().withMessage('معرف رئيس الأطباء غير صحيح'),
  body('specializationRequirements')
    .optional()
    .isArray().withMessage('متطلبات التخصص يجب أن تكون مصفوفة'),
  handleValidationErrors
];

// التحقق من بيانات طلب النقل
const validateTransfer = [
  body('doctorId')
    .trim()
    .notEmpty().withMessage('معرف الطبيب مطلوب')
    .isMongoId().withMessage('معرف الطبيب غير صحيح'),
  body('fromHospitalId')
    .trim()
    .notEmpty().withMessage('معرف المستشفى الحالي مطلوب')
    .isMongoId().withMessage('معرف المستشفى غير صحيح'),
  body('toHospitalId')
    .trim()
    .notEmpty().withMessage('معرف المستشفى المستهدف مطلوب')
    .isMongoId().withMessage('معرف المستشفى غير صحيح'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('السبب يجب ألا يتجاوز 500 حرف'),
  handleValidationErrors
];

// التحقق من MongoDB ObjectId
const validateObjectId = (paramName) => [
  param(paramName)
    .trim()
    .isMongoId().withMessage(`${paramName} غير صحيح`),
  handleValidationErrors
];

// التحقق من تحديث كلمة المرور
const validatePasswordChange = [
  body('oldPassword')
    .trim()
    .notEmpty().withMessage('كلمة المرور القديمة مطلوبة'),
  body('newPassword')
    .trim()
    .isLength({ min: 8 }).withMessage('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم')
    .notEmpty().withMessage('كلمة المرور الجديدة مطلوبة'),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => value === req.body.newPassword).withMessage('كلمات المرور غير متطابقة'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateRegister,
  validateDoctor,
  validateHospital,
  validateTransfer,
  validateObjectId,
  validatePasswordChange,
  handleValidationErrors
};
