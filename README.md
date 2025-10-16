# 🏥 نظام إدارة الأطباء والمستشفيات

نظام شامل لإدارة الأطباء، المستشفيات، والنقل بين المستشفيات مع واجهة عربية كاملة.

## ✨ المميزات

### 🔐 نظام الصلاحيات
- **Admin (المدير)**: إدارة كاملة للنظام
- **Health Directorate (مديرية الصحة)**: الموافقة على طلبات النقل
- **Chief of Doctors (رئيس الأطباء)**: إدارة أطباء المستشفى وطلبات النقل

### 👨‍⚕️ إدارة الأطباء
- إضافة وتعديل وحذف الأطباء
- 26 تخصص طبي متاح
- تتبع حالة الدوام (مستمر، إجازة مرضية، إجازة أمومة، إجازة طويلة)
- عرض ملف الطبيب الكامل

### 🏥 إدارة المستشفيات
- إضافة وتعديل المستشفيات
- تحديد متطلبات التخصصات لكل مستشفى
- تعيين رئيس أطباء لكل مستشفى
- إحصائيات مفصلة لكل مستشفى

### 🔄 نظام النقل
- طلبات نقل الأطباء بين المستشفيات
- نقل مباشر من قبل رئيس الأطباء
- الموافقة/الرفض من قبل مديرية الصحة
- سجل كامل لجميع عمليات النقل

### 🔔 نظام الإشعارات
- إشعارات فورية لجميع العمليات
- عرض واضح وسهل القراءة
- تصنيف حسب النوع (موافقة، رفض، طلب نقل)

### 📊 لوحات التحكم
- إحصائيات شاملة
- رسوم بيانية تفاعلية
- تقارير مفصلة

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19.1.1**: مكتبة واجهة المستخدم
- **TypeScript**: للكود الآمن من الأخطاء
- **Vite**: أداة بناء سريعة
- **Styled Components**: للتصميم
- **Recharts**: للرسوم البيانية
- **Lucide React**: للأيقونات

### Backend
- **Node.js + Express.js**: سيرفر API
- **MongoDB + Mongoose**: قاعدة البيانات
- **JWT**: المصادقة والتفويض
- **bcryptjs**: تشفير كلمات المرور
- **helmet**: حماية HTTP headers
- **express-rate-limit**: الحماية من DDoS
- **express-validator**: التحقق من صحة المدخلات

## 🔒 إعدادات الأمان

✅ **JWT Secret** عشوائي وقوي (128 حرف)  
✅ **CORS** محدود للمصادر الموثوقة فقط  
✅ **Rate Limiting** لتحديد عدد الطلبات  
✅ **Helmet.js** لحماية HTTP headers  
✅ **Input Validation** للتحقق من جميع المدخلات  
✅ **Password Hashing** مع bcrypt  
✅ **MongoDB Injection Protection** عبر Mongoose  
✅ **.env** محمي في .gitignore

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18 أو أحدث
- MongoDB 6.0 أو أحدث
- npm أو yarn

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd healthcare-management
```

### 2. إعداد Backend

```bash
cd backend
npm install

# إنشاء ملف .env
cp .env.example .env
# عدّل الملف وأضف JWT_SECRET قوي

# تشغيل السيرفر
npm start
```

### 3. إعداد Frontend

```bash
cd ..  # العودة للمجلد الرئيسي
npm install

# تشغيل التطبيق
npm run dev
```

### 4. تشغيل الكل معاً

```bash
npm run dev:full
```

### 5. الوصول للتطبيق

افتح المتصفح على:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### حسابات تجريبية افتراضية

```
Admin:
البريد: admin@healthcare.com
كلمة المرور: admin123

مديرية الصحة:
البريد: health@healthcare.com
كلمة المرور: health123

رئيس الأطباء:
البريد: chief@healthcare.com
كلمة المرور: chief123
```

## 📁 هيكل المشروع

```
healthcare-management/
├── backend/
│   ├── config/          # إعدادات قاعدة البيانات
│   ├── middleware/      # Authentication & Validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── .env            # متغيرات البيئة (لا تُنشر على Git)
│   ├── .env.example    # نموذج المتغيرات
│   └── server.js       # نقطة بداية السيرفر
├── src/
│   ├── components/     # مكونات React
│   ├── context/        # State management
│   ├── pages/          # صفحات التطبيق
│   ├── services/       # API calls
│   ├── types/          # TypeScript types
│   └── App.tsx         # المكون الرئيسي
├── DEPLOYMENT.md       # دليل النشر الكامل
└── README.md          # هذا الملف
```

## 📚 الوثائق

للحصول على دليل مفصل حول كيفية نشر التطبيق على سيرفر إنتاج:

👉 **[دليل النشر الكامل](DEPLOYMENT.md)**

يشمل:
- إعداد MongoDB Atlas
- النشر على Heroku/Vercel
- النشر على VPS (DigitalOcean/AWS)
- إعدادات SSL/HTTPS
- النسخ الاحتياطي والصيانة
- استكشاف الأخطاء

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - معلومات المستخدم الحالي

### Doctors
- `GET /api/doctors` - قائمة الأطباء
- `POST /api/doctors` - إضافة طبيب
- `PUT /api/doctors/:id` - تعديل طبيب
- `DELETE /api/doctors/:id` - حذف طبيب

### Hospitals
- `GET /api/hospitals` - قائمة المستشفيات
- `POST /api/hospitals` - إضافة مستشفى
- `PUT /api/hospitals/:id` - تعديل مستشفى
- `DELETE /api/hospitals/:id` - حذف مستشفى

### Transfers
- `GET /api/transfers` - قائمة طلبات النقل
- `POST /api/transfers` - إنشاء طلب نقل
- `PUT /api/transfers/:id` - تحديث حالة النقل

### Notifications
- `GET /api/notifications` - قائمة الإشعارات
- `PUT /api/notifications/:id/read` - تعيين كمقروء
- `DELETE /api/notifications/:id` - حذف إشعار

## 🧪 الاختبار

```bash
# اختبار Backend
cd backend
npm test

# اختبار Frontend
cd ..
npm test
```

## 🤝 المساهمة

المساهمات مرحب بها! الرجاء فتح Issue أو Pull Request.

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License.

## 👨‍💻 المطور

تم التطوير بواسطة فريق إدارة الرعاية الصحية

---

**ملاحظة مهمة**: لا تنسى تغيير `JWT_SECRET` في ملف `.env` قبل النشر على سيرفر الإنتاج!

**للنشر**: اتبع الخطوات المفصلة في [DEPLOYMENT.md](DEPLOYMENT.md)
