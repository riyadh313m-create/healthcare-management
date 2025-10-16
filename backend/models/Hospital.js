const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hospital', 'health_center'],
    required: true
  },
  requiredDoctors: {
    type: Number,
    required: true,
    min: 1
  },
  currentDoctors: {
    type: Number,
    default: 0
  },
  specializationRequirements: [{
    specialization: {
      type: String,
      enum: [
        'الجراحة العامة',
        'الكسور',
        'البولية',
        'النسائية',
        'الاطفال',
        'الباطنية',
        'العيون',
        'ENT',
        'جراحة صدر',
        'جراحة جملة عصبية',
        'جملة عصبية',
        'جراحة تجميلية',
        'نفسية',
        'مفاصل',
        'جلدية',
        'طوارئ',
        'جراحة اطفال',
        'تنفسية',
        'امراض كلى',
        'فاملي',
        'مقيم دوري',
        'أنعاش',
        'أشعة تشخيصية',
        'أشعة تداخلية',
        'طب عام',
        'الطب النووي',
        'الاورام',
        'الايكو',
        'التخدير',
        'تدرج'
      ]
    },
    required: {
      type: Number,
      min: 0
    },
    current: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
hospitalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);