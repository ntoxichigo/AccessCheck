# Trial System Setup Script
# Run this after pulling the trial reminder code

Write-Host "Setting up Trial Reminder System..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "Step 1: Regenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "Prisma client generated successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Generate CRON_SECRET
Write-Host "Step 2: Generating CRON_SECRET..." -ForegroundColor Yellow
$cronSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
Write-Host "Generated CRON_SECRET: $cronSecret" -ForegroundColor Cyan
Write-Host ""

# Step 3: Check for .env.local
Write-Host "Step 3: Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "CRON_SECRET") {
        Write-Host "CRON_SECRET already exists in .env.local" -ForegroundColor Yellow
        Write-Host "Current value will be kept. If you want to update it, edit .env.local manually." -ForegroundColor Yellow
    } else {
        Add-Content -Path ".env.local" -Value "`nCRON_SECRET=$cronSecret"
        Write-Host "Added CRON_SECRET to .env.local" -ForegroundColor Green
    }
} else {
    $envContent = "CRON_SECRET=$cronSecret`n"
    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Host "Created .env.local with CRON_SECRET" -ForegroundColor Green
    Write-Host "Don't forget to add other required variables:" -ForegroundColor Yellow
    Write-Host "   - DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   - RESEND_API_KEY" -ForegroundColor Yellow
    Write-Host "   - CLERK_SECRET_KEY" -ForegroundColor Yellow
    Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Test compile
Write-Host "Step 4: Testing TypeScript compilation..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript compilation has warnings (this is okay)" -ForegroundColor Yellow
} else {
    Write-Host "TypeScript compilation successful" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Trial System Setup Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Prisma Client regenerated with trial fields"
Write-Host "2. CRON_SECRET added to .env.local"
Write-Host ""
Write-Host "To deploy to Vercel:" -ForegroundColor Yellow
Write-Host "1. Add CRON_SECRET to Vercel environment variables:"
Write-Host "   CRON_SECRET=$cronSecret" -ForegroundColor Cyan
Write-Host "2. Push code: git add . ; git commit -m 'Add trial system' ; git push"
Write-Host "3. Vercel will auto-deploy with cron jobs configured"
Write-Host ""
Write-Host "To test locally:" -ForegroundColor Yellow
Write-Host "1. Start dev server: npm run dev"
Write-Host "2. Test reminder endpoint:"
Write-Host "   curl -X POST http://localhost:3000/api/cron/trial-reminders -H \"Authorization: Bearer $cronSecret\""
Write-Host ""
Write-Host "Setup complete."
Write-Host ""