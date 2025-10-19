# Clean up old documentation files
# This script moves old documentation to an archive folder

$sourceDir = "C:\Users\anton\OneDrive\Desktop\AccessCheck-main\accessibility-checker"
$archiveDir = "$sourceDir\docs-archive"

# Create archive directory if it doesn't exist
if (-not (Test-Path $archiveDir)) {
    New-Item -ItemType Directory -Path $archiveDir | Out-Null
    Write-Host "✅ Created archive directory: $archiveDir" -ForegroundColor Green
}

# Files to keep (important ones)
$keepFiles = @(
    "README.md",
    "SCRIPTS_REFERENCE.md"
)

# Get all .md files in the root directory
$mdFiles = Get-ChildItem -Path $sourceDir -Filter "*.md" -File

Write-Host "`n📋 Found $($mdFiles.Count) markdown files" -ForegroundColor Cyan

$movedCount = 0

foreach ($file in $mdFiles) {
    if ($keepFiles -contains $file.Name) {
        Write-Host "⏭️  Keeping: $($file.Name)" -ForegroundColor Yellow
    } 
    else {
        Move-Item -Path $file.FullName -Destination $archiveDir -Force -ErrorAction SilentlyContinue
        if ($?) {
            Write-Host "📦 Archived: $($file.Name)" -ForegroundColor Green
            $movedCount++
        }
        else {
            Write-Host "❌ Failed to move: $($file.Name)" -ForegroundColor Red
        }
    }
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "   Archived: $movedCount files" -ForegroundColor Cyan
Write-Host "   Location: $archiveDir" -ForegroundColor Cyan
