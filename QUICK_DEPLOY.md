# 🚀 النشر السريع - الأوامر فقط

## خطوات النشر السريعة

### 1️⃣ MongoDB Atlas
```bash
# افتح: https://www.mongodb.com/cloud/atlas/register
# سجّل حساب → اختر M0 Free → احصل على Connection String
```

### 2️⃣ Backend على Heroku
```bash
# تثبيت Heroku CLI من: https://devcenter.heroku.com/articles/heroku-cli

# تسجيل الدخول
heroku login

# إنشاء تطبيق
cd E:\nd\backend
heroku create healthcare-api-prod

# إضافة المتغيرات
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/healthcare_management"
heroku config:set JWT_SECRET="your_jwt_secret_here"
heroku config:set NODE_ENV="production"
heroku config:set ALLOWED_ORIGINS="http://localhost:5173"

# Git و Push
git init
git add .
git commit -m "Deploy to production"
heroku git:remote -a healthcare-api-prod
git push heroku main

# التحقق
heroku open
heroku logs --tail
```

### 3️⃣ Frontend على Vercel
```bash
# تثبيت Vercel
npm install -g vercel

# تحديث API URL في src/services/apiService.ts
# const API_BASE_URL = 'https://healthcare-api-prod.herokuapp.com/api';

# بناء و نشر
cd E:\nd
npm run build
vercel login
vercel --prod

# إضافة Environment Variable
vercel env add VITE_API_URL production
# أدخل: https://healthcare-api-prod.herokuapp.com/api

# إعادة النشر
vercel --prod
```

### 4️⃣ تحديث CORS
```bash
cd E:\nd\backend
heroku config:set ALLOWED_ORIGINS="https://your-vercel-url.vercel.app"
git push heroku main
```

---

## ✅ تم!
- Frontend: https://your-app.vercel.app
- Backend: https://healthcare-api-prod.herokuapp.com
- Database: MongoDB Atlas

---

## 🐛 أخطاء شائعة

### CORS Error:
```bash
heroku config:set ALLOWED_ORIGINS="https://correct-url.vercel.app"
```

### MongoDB Connection:
```bash
# تأكد من:
1. IP Whitelist = 0.0.0.0/0
2. كلمة المرور صحيحة
3. Connection String كامل
```

### Heroku Error:
```bash
heroku logs --tail  # اقرأ الأخطاء
```

---

**الدعم الكامل في**: `DEPLOYMENT_GUIDE.md`
