const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    enum: ['اخصائي', 'مقيم اقدم', 'تدرج', 'مقيم دوري', 'طبيب عام', 'طبيب اختصاص', 'طبيب استشاري', 'طبيب مقيم', 'رئيس أطباء', 'نائب رئيس أطباء'],
    required: true
  },
  graduationYear: {
    type: Number,
    required: true,
    min: 1980,
    max: new Date().getFullYear()
  },
  originalHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  currentHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
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
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['مستمر بالدوام', 'في إجازة', 'منقول', 'اجازة مرضية', 'اجازة امومة', 'اجازة طويلة'],
    default: 'مستمر بالدوام'
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
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
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isArchived && !this.archivedAt) {
    this.archivedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);