const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===================================
// إعدادات الأمان - Security Headers
// ===================================
// حماية من الهجمات الشائعة عبر HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// ===================================
// إعدادات CORS - Cross-Origin Resource Sharing
// ===================================
// السماح فقط للمصادر المحددة في المتغيرات البيئية
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
  origin: function(origin, callback) {
    // السماح بالطلبات بدون origin (مثل mobile apps أو curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ===================================
// إعدادات Rate Limiting - الحماية من DDoS
// ===================================
// تحديد عدد الطلبات المسموح بها من نفس IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 دقيقة افتراضياً (بالميلي ثانية)
  max: parseInt(process.env.RATE_LIMIT_MAX || 100), // 100 طلب افتراضياً
  message: 'لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.',
  standardHeaders: true,
  legacyHeaders: false,
});

// تطبيق rate limiting على جميع المسارات
app.use(limiter);

// rate limiting أكثر صرامة لمسارات المصادقة
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 5, // 5 محاولات فقط
  message: 'لقد تجاوزت عدد محاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة.',
  skipSuccessfulRequests: true,
});

// ===================================
// Middleware الأساسي
// ===================================
app.use(express.json({ limit: '10mb' })); // تحديد حجم الطلبات
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===================================
// MongoDB Connection - الاتصال بقاعدة البيانات
// ===================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_management')
.then(() => {
  console.log('Connected to MongoDB');
  console.log(`Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // إيقاف السيرفر إذا فشل الاتصال بقاعدة البيانات
});

// معالجة أخطاء الاتصال بعد الاتصال الأولي
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// ===================================
// Routes - المسارات
// ===================================
// تطبيق rate limiting الصارم على مسارات المصادقة
app.use('/api/auth', authLimiter, require('./routes/auth'));

// المسارات الأخرى
app.use('/api/users', require('./routes/users'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/history', require('./routes/history'));

// ===================================
// معالج الأخطاء - Error Handler
// ===================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // عدم إظهار تفاصيل الأخطاء في الإنتاج
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({
      message: 'حدث خطأ في السيرفر',
      error: {}
    });
  } else {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare Management API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// مسار للتحقق من صحة السيرفر
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});

module.exports = app;