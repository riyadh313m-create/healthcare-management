# 🚀 دليل نشر نظام إدارة الأطباء

## 📋 المحتويات
1. [متطلبات النشر](#متطلبات-النشر)
2. [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات)
3. [إعداد Backend](#إعداد-backend)
4. [إعداد Frontend](#إعداد-frontend)
5. [إعدادات الأمان](#إعدادات-الأمان)
6. [النشر على السيرفر](#النشر-على-السيرفر)
7. [صيانة ومراقبة](#صيانة-ومراقبة)

---

## 📦 متطلبات النشر

### المتطلبات الأساسية:
- **Node.js**: الإصدار 18 أو أحدث
- **MongoDB**: الإصدار 6.0 أو أحدث (يفضل MongoDB Atlas للإنتاج)
- **npm أو yarn**: لإدارة الحزم
- **Domain name**: اسم نطاق للموقع (اختياري لكن موصى به)
- **SSL Certificate**: شهادة SSL للحماية (Let's Encrypt مجاني)

### خيارات الاستضافة الموصى بها:
- **Backend**: 
  - Heroku (سهل ومجاني للبداية)
  - DigitalOcean (مرن وقوي)
  - AWS EC2 (للمشاريع الكبيرة)
  - Railway.app (حديث وسريع)
  
- **Frontend**: 
  - Vercel (موصى به بشدة - مجاني وسريع)
  - Netlify (ممتاز للـ React)
  - GitHub Pages (مجاني لكن محدود)
  
- **Database**: 
  - MongoDB Atlas (موصى به - مجاني حتى 512MB)
  - MongoDB على DigitalOcean Managed Database

---

## 🗄️ إعداد قاعدة البيانات

### الخيار 1: MongoDB Atlas (موصى به)

1. **إنشاء حساب**:
   ```
   - اذهب إلى https://www.mongodb.com/cloud/atlas
   - أنشئ حساب مجاني
   - اختر خطة Free (M0) - مجاني حتى 512MB
   ```

2. **إنشاء Cluster**:
   ```
   - اختر Provider: AWS/Azure/Google Cloud
   - اختر Region: أقرب منطقة لبلدك (مثلاً Frankfurt لأوروبا)
   - اسم الـ Cluster: healthcare-management
   ```

3. **إعداد الوصول**:
   ```
   - Database Access: أنشئ مستخدم بكلمة مرور قوية
   - Network Access: أضف IP Address
     * للتطوير: 0.0.0.0/0 (جميع IPs)
     * للإنتاج: عنوان IP السيرفر فقط
   ```

4. **الحصول على Connection String**:
   ```
   - اضغط على "Connect"
   - اختر "Connect your application"
   - انسخ الـ Connection String:
   
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/healthcare_management?retryWrites=true&w=majority
   ```

### الخيار 2: MongoDB محلي

إذا كنت تستخدم سيرفر خاص:

```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# إنشاء قاعدة البيانات
mongosh
> use healthcare_management
> db.createUser({
    user: "healthcare_admin",
    pwd: "strong_password_here",
    roles: ["readWrite"]
  })
```

---

## ⚙️ إعداد Backend

### 1. استنساخ المشروع

```bash
git clone <your-repository-url>
cd healthcare-management/backend
```

### 2. تثبيت الاعتماديات

```bash
npm install
```

### 3. إنشاء ملف `.env`

انسخ `.env.example` إلى `.env` وعدّل القيم:

```env
# قاعدة البيانات
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare_management

# مفتاح JWT (استخدم الأمر التالي لتوليد مفتاح آمن)
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_generated_secret_key_here

# إعدادات السيرفر
PORT=5000
NODE_ENV=production

# CORS - ضع عنوان موقعك الفعلي
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# JWT
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=15
```

### 4. توليد JWT Secret آمن

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
انسخ الناتج وضعه في `JWT_SECRET`

### 5. اختبار Backend محلياً

```bash
npm start
```

تحقق من أن السيرفر يعمل:
```bash
curl http://localhost:5000/health
```

---

## 🎨 إعداد Frontend

### 1. الانتقال لمجلد Frontend

```bash
cd ../  # العودة للمجلد الرئيسي
```

### 2. تحديث عنوان API

عدّل ملف `src/services/apiService.ts`:

```typescript
// قبل النشر
const API_BASE_URL = 'http://localhost:5000/api';

// بعد النشر - ضع عنوان Backend الفعلي
const API_BASE_URL = 'https://your-backend-domain.com/api';
// أو
const API_BASE_URL = process.env.VITE_API_URL || 'https://your-backend-domain.com/api';
```

### 3. إنشاء ملف `.env` للـ Frontend (اختياري)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### 4. بناء Frontend

```bash
npm run build
```

سينشئ مجلد `dist` يحتوي على الملفات الثابتة الجاهزة للنشر

---

## 🔒 إعدادات الأمان

### قائمة التحقق الأمنية:

- [x] **JWT Secret قوي**: تم توليده عشوائياً (128 حرف)
- [x] **HTTPS**: يجب استخدام HTTPS في الإنتاج
- [x] **CORS محدود**: السماح فقط للنطاقات الموثوقة
- [x] **Rate Limiting**: تحديد عدد الطلبات لكل IP
- [x] **Helmet.js**: حماية HTTP headers
- [x] **Input Validation**: التحقق من صحة جميع المدخلات
- [x] **MongoDB Injection**: استخدام Mongoose يحمي تلقائياً
- [x] **Password Hashing**: bcrypt مع 10 rounds
- [ ] **Environment Variables**: لا تنشر ملفات `.env` على Git
- [ ] **Error Messages**: عدم إظهار تفاصيل الأخطاء في الإنتاج
- [ ] **Logging**: استخدام مكتبة Logging مناسبة
- [ ] **Backup**: نسخ احتياطي منتظم لقاعدة البيانات

### إعدادات إضافية للإنتاج:

1. **تفعيل HTTPS Redirect**:
```javascript
// في server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

2. **تحديث CORS للإنتاج**:
```env
ALLOWED_ORIGINS=https://yourdomain.com
```

3. **MongoDB IP Whitelist**:
   - في MongoDB Atlas، أضف عنوان IP السيرفر فقط
   - احذف `0.0.0.0/0` إذا كان موجوداً

---

## 🌐 النشر على السيرفر

### الخيار 1: النشر على Heroku (Backend)

1. **تثبيت Heroku CLI**:
```bash
npm install -g heroku
```

2. **تسجيل الدخول**:
```bash
heroku login
```

3. **إنشاء تطبيق**:
```bash
cd backend
heroku create healthcare-management-api
```

4. **إضافة المتغيرات البيئية**:
```bash
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set NODE_ENV="production"
heroku config:set ALLOWED_ORIGINS="https://your-frontend-domain.com"
```

5. **النشر**:
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **التحقق**:
```bash
heroku logs --tail
heroku open
```

### الخيار 2: النشر على Vercel (Frontend)

1. **تثبيت Vercel CLI**:
```bash
npm install -g vercel
```

2. **تسجيل الدخول**:
```bash
vercel login
```

3. **النشر**:
```bash
cd frontend
vercel
```

4. **اتبع الخطوات**:
   - Project name: healthcare-management
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **إضافة Environment Variable**:
```bash
vercel env add VITE_API_URL production
# أدخل: https://healthcare-management-api.herokuapp.com/api
```

### الخيار 3: النشر على VPS (DigitalOcean/AWS)

#### A. إعداد السيرفر

```bash
# الاتصال بالسيرفر
ssh root@your_server_ip

# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت PM2 لإدارة التطبيق
npm install -g pm2

# تثبيت Nginx
apt install -y nginx

# تثبيت Certbot للـ SSL
apt install -y certbot python3-certbot-nginx
```

#### B. رفع المشروع

```bash
# استنساخ المشروع
cd /var/www
git clone <your-repo-url> healthcare-management
cd healthcare-management/backend

# تثبيت الاعتماديات
npm install --production

# إنشاء ملف .env (انسخ المحتوى)
nano .env
```

#### C. تشغيل Backend مع PM2

```bash
# تشغيل التطبيق
pm2 start server.js --name healthcare-backend

# حفظ التكوين
pm2 save

# تفعيل التشغيل التلقائي
pm2 startup
```

#### D. إعداد Nginx

```bash
nano /etc/nginx/sites-available/healthcare
```

أضف:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/healthcare-management/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

تفعيل:
```bash
ln -s /etc/nginx/sites-available/healthcare /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### E. إعداد SSL مع Let's Encrypt

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## 📊 صيانة ومراقبة

### مراقبة Logs

```bash
# PM2 logs
pm2 logs healthcare-backend

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### نسخ احتياطي لقاعدة البيانات

```bash
# MongoDB Atlas - نسخ احتياطي تلقائي
# أو يدوياً:
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### تحديث التطبيق

```bash
cd /var/www/healthcare-management
git pull
cd backend
npm install --production
pm2 restart healthcare-backend
```

### مراقبة الأداء

استخدم:
- **PM2 Monitoring**: `pm2 monitor`
- **MongoDB Atlas Monitoring**: لوحة التحكم
- **Uptime Robot**: مراقبة مجانية

---

## ⚠️ استكشاف الأخطاء

### مشكلة: CORS Error

**الحل**:
```env
# تأكد من أن ALLOWED_ORIGINS صحيح
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### مشكلة: MongoDB Connection Failed

**الحل**:
1. تحقق من صحة Connection String
2. تأكد من إضافة IP السيرفر في MongoDB Atlas
3. تحقق من username/password

### مشكلة: 502 Bad Gateway

**الحل**:
```bash
# تحقق من أن Backend يعمل
pm2 status
pm2 logs healthcare-backend

# إعادة تشغيل
pm2 restart healthcare-backend
```

---

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
- Logs في PM2 أو Heroku
- MongoDB Atlas logs
- Nginx error logs

---

## 🎉 تهانينا!

إذا اتبعت جميع الخطوات، فإن تطبيقك الآن:
- ✅ آمن ومحمي
- ✅ جاهز للإنتاج
- ✅ قابل للتوسع
- ✅ محمي من الهجمات الشائعة

**نصيحة أخيرة**: ابدأ بمراقبة التطبيق في أول أيام النشر للتأكد من عدم وجود مشاكل.

---

**تاريخ آخر تحديث**: أكتوبر 2025
**الإصدار**: 1.0.0
