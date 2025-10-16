# Script to prepare for deployment
Write-Host "🚀 تجهيز المشروع للنشر..." -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "✓ التحقق من Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version
Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Gray
Write-Host ""

# Check npm
Write-Host "✓ التحقق من npm..." -ForegroundColor Cyan
$npmVersion = npm --version
Write-Host "  npm version: $npmVersion" -ForegroundColor Gray
Write-Host ""

# Check Git
Write-Host "✓ التحقق من Git..." -ForegroundColor Cyan
try {
    $gitVersion = git --version
    Write-Host "  Git version: $gitVersion" -ForegroundColor Gray
} catch {
    Write-Host "  ⚠️ Git غير مثبت! يرجى تثبيته من: https://git-scm.com/" -ForegroundColor Yellow
}
Write-Host ""

# Check Backend dependencies
Write-Host "✓ التحقق من Backend dependencies..." -ForegroundColor Cyan
if (Test-Path ".\backend\node_modules") {
    Write-Host "  ✓ Backend dependencies موجودة" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Backend dependencies غير موجودة" -ForegroundColor Yellow
    Write-Host "  تثبيت..." -ForegroundColor Gray
    Set-Location backend
    npm install
    Set-Location ..
}
Write-Host ""

# Check Frontend dependencies
Write-Host "✓ التحقق من Frontend dependencies..." -ForegroundColor Cyan
if (Test-Path ".\node_modules") {
    Write-Host "  ✓ Frontend dependencies موجودة" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Frontend dependencies غير موجودة" -ForegroundColor Yellow
    Write-Host "  تثبيت..." -ForegroundColor Gray
    npm install
}
Write-Host ""

# Check .env file
Write-Host "✓ التحقق من ملف .env..." -ForegroundColor Cyan
if (Test-Path ".\backend\.env") {
    Write-Host "  ✓ ملف .env موجود" -ForegroundColor Green
    
    # Check JWT_SECRET
    $envContent = Get-Content ".\backend\.env" -Raw
    if ($envContent -match "JWT_SECRET=.{64,}") {
        Write-Host "  ✓ JWT_SECRET قوي" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ JWT_SECRET ضعيف أو غير موجود!" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️ ملف .env غير موجود!" -ForegroundColor Yellow
    Write-Host "  يرجى نسخ .env.example إلى .env وتعديله" -ForegroundColor Gray
}
Write-Host ""

# Check Procfile
Write-Host "✓ التحقق من Procfile..." -ForegroundColor Cyan
if (Test-Path ".\backend\Procfile") {
    Write-Host "  ✓ Procfile موجود" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Procfile غير موجود!" -ForegroundColor Yellow
}
Write-Host ""

# Build Frontend
Write-Host "✓ بناء Frontend..." -ForegroundColor Cyan
Write-Host "  تشغيل npm run build..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ تم بناء Frontend بنجاح" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ فشل بناء Frontend!" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 ملخص الجاهزية للنشر" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check Heroku CLI
Write-Host "🔧 أدوات النشر المطلوبة:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Heroku CLI:" -ForegroundColor Cyan
try {
    $herokuVersion = heroku --version
    Write-Host "    ✓ مثبت: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "    ✗ غير مثبت" -ForegroundColor Red
    Write-Host "    تثبيت من: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Gray
}
Write-Host ""

Write-Host "  Vercel CLI:" -ForegroundColor Cyan
try {
    $vercelVersion = vercel --version
    Write-Host "    ✓ مثبت: Vercel CLI $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "    ✗ غير مثبت" -ForegroundColor Red
    Write-Host "    تثبيت بـ: npm install -g vercel" -ForegroundColor Gray
}
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "  1. راجع ملف DEPLOYMENT_GUIDE.md للتعليمات الكاملة" -ForegroundColor Gray
Write-Host "  2. راجع ملف QUICK_DEPLOY.md للأوامر السريعة" -ForegroundColor Gray
Write-Host "  3. سجّل في MongoDB Atlas: https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
Write-Host "  4. نفّذ الأوامر من QUICK_DEPLOY.md" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ جاهز للنشر! ✨" -ForegroundColor Green
Write-Host ""
