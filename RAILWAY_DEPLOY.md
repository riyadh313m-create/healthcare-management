# 🚄 دليل النشر على Railway - 5 دقائق فقط!

## ✨ لماذا Railway؟
- ✅ **بدون بطاقة ائتمان**
- ✅ **$5 مجاناً شهرياً**
- ✅ **نشر Backend + Frontend معاً**
- ✅ **أسهل من Heroku**

---

# 🎯 خطوات النشر

## الخطوة 1️⃣: إنشاء حساب Railway

1. **اذهب إلى**: https://railway.app
2. **اضغط على**: "Start a New Project"
3. **سجّل دخول بـ GitHub** (أسهل طريقة)

---

## الخطوة 2️⃣: رفع المشروع على GitHub (إذا لم يكن موجوداً)

### أ. إنشاء Repository على GitHub:
1. اذهب إلى: https://github.com/new
2. اسم Repository: `healthcare-management`
3. اجعله **Private**
4. **لا تضف** README أو .gitignore
5. Create Repository

### ب. رفع الكود:

```bash
cd E:\nd

# تهيئة Git (إذا لم يكن مهيأ)
git init

# إضافة جميع الملفات
git add .

# Commit
git commit -m "Initial commit for Railway deployment"

# ربط بـ GitHub (استبدل username باسم حسابك)
git remote add origin https://github.com/YOUR_USERNAME/healthcare-management.git

# Push
git branch -M main
git push -u origin main
```

---

## الخطوة 3️⃣: نشر Backend على Railway

### أ. إنشاء مشروع جديد:
1. في Railway Dashboard، اضغط: **"New Project"**
2. اختر: **"Deploy from GitHub repo"**
3. اختر: `healthcare-management`
4. Railway سيكتشف المشروع تلقائياً

### ب. إضافة MongoDB (اختياري):
إذا أردت استخدام MongoDB على Railway بدلاً من Atlas:
1. في نفس المشروع، اضغط: **"+ New"**
2. اختر: **"Database"** → **"Add MongoDB"**
3. Railway سيعطيك Connection String تلقائياً

### ج. ضبط Environment Variables للـ Backend:

في Railway Dashboard → Project → Backend Service:

1. اضغط على **"Variables"**
2. أضف المتغيرات التالية:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string-here
JWT_SECRET=b08500e7aeb953b45e2464e769d763d11230b00475411dfd2b6487e7356ec64627973b5d6ce72b04415817c6b4e43710efce0b135a8f42bde475552dfb623099
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### د. ضبط Root Directory للـ Backend:

⚠️ **مهم جداً!**

1. في Settings → اذهب لـ **"Service"**
2. ابحث عن **"Root Directory"**
3. اكتب: `backend`
4. احفظ التغييرات

### هـ. إضافة Start Command:

1. في Settings → **"Deploy"**
2. ابحث عن **"Start Command"**
3. اكتب: `node server.js`
4. احفظ

### و. احصل على Backend URL:

1. في Settings → **"Networking"**
2. اضغط: **"Generate Domain"**
3. ستحصل على رابط مثل: `https://healthcare-api-production.up.railway.app`
4. **احفظ هذا الرابط!**

---

## الخطوة 4️⃣: تحديث Frontend للإنتاج

### أ. تعديل apiService.ts:

عدّل الملف `src/services/apiService.ts`:

```typescript
// استبدل السطر:
const API_BASE_URL = 'http://localhost:5000/api';

// بهذا (استخدم رابط Railway الخاص بك):
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://healthcare-api-production.up.railway.app/api';
```

### ب. حفظ ورفع التغييرات:

```bash
cd E:\nd

git add .
git commit -m "Update API URL for production"
git push origin main
```

---

## الخطوة 5️⃣: نشر Frontend على Railway

### أ. إضافة Frontend Service:

1. في نفس المشروع Railway، اضغط: **"+ New"**
2. اختر: **"GitHub Repo"**
3. اختر نفس Repository: `healthcare-management`

### ب. ضبط Root Directory للـ Frontend:

1. في Settings → **"Service"**
2. **Root Directory**: اتركه فارغ (أو اكتب `.`)
3. احفظ

### ج. إضافة Environment Variables للـ Frontend:

```env
VITE_API_URL=https://healthcare-api-production.up.railway.app/api
```

### د. ضبط Build و Start Commands:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm run preview`

### هـ. احصل على Frontend URL:

1. في Settings → **"Networking"**
2. اضغط: **"Generate Domain"**
3. ستحصل على رابط مثل: `https://healthcare-management.up.railway.app`

---

## الخطوة 6️⃣: تحديث CORS

الآن حدّث CORS في Backend:

1. ارجع لـ Backend Service في Railway
2. في Variables، حدّث `ALLOWED_ORIGINS`:

```env
ALLOWED_ORIGINS=https://healthcare-management.up.railway.app
```

3. Railway سيعيد النشر تلقائياً

---

## الخطوة 7️⃣: الاختبار النهائي ✅

### 1. اختبر Backend:
```bash
curl https://healthcare-api-production.up.railway.app/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "...",
  "mongodb": "connected"
}
```

### 2. افتح Frontend:
```
https://healthcare-management.up.railway.app
```

### 3. جرّب الميزات:
- ✅ تسجيل الدخول
- ✅ إضافة بيانات
- ✅ الإشعارات
- ✅ النقل بين المستشفيات

---

# 🎉 تم بنجاح!

موقعك الآن على الإنترنت:
- **Frontend**: https://healthcare-management.up.railway.app
- **Backend**: https://healthcare-api-production.up.railway.app
- **Database**: MongoDB Atlas (أو Railway MongoDB)

---

# 📊 مراقبة التطبيق

## 1. عرض Logs:
في Railway Dashboard → اختر Service → تبويب **"Deployments"**

## 2. استخدام الموارد:
تبويب **"Metrics"** لمشاهدة:
- CPU Usage
- Memory Usage
- Network Traffic

## 3. Restart التطبيق:
في Settings → **"Restart"**

---

# 🆘 استكشاف الأخطاء الشائعة

### ❌ Build Failed
```bash
# تحقق من:
1. Root Directory صحيح؟
2. Start Command صحيح؟
3. dependencies في package.json؟
```

### ❌ CORS Error
```bash
# حدّث ALLOWED_ORIGINS في Backend Variables
ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

### ❌ MongoDB Connection Failed
```bash
# تحقق من:
1. Connection String صحيح؟
2. IP Whitelist: 0.0.0.0/0
3. Username & Password صحيحين؟
```

### ❌ Application Crashed
```bash
# في Railway Dashboard:
1. اذهب لـ Service → Deployments
2. اضغط على آخر Deployment
3. اقرأ الـ Logs
4. أصلح المشكلة
```

---

# 💡 نصائح مهمة

1. **استخدم MongoDB Atlas** (أفضل من Railway MongoDB للإنتاج)
2. **راقب الاستخدام**: لديك $5 شهرياً فقط
3. **احفظ الروابط**: Backend و Frontend URLs
4. **Backup البيانات** بانتظام

---

# 🚀 ما القادم؟

1. **Domain مخصص** (اختياري):
   - في Railway Settings → Networking → Custom Domain
   
2. **SSL Certificate**: ✅ تلقائي في Railway!

3. **Environment Branches**:
   - أنشئ branches لـ development/staging/production

---

**هل واجهت أي مشكلة؟** أخبرني! 💪
