# Stop on errors
$ErrorActionPreference = "Stop"

# 1. Go to project directory
$projectDir = "C:\GreenMeter"
Set-Location $projectDir

# 2. Pull latest code
Write-Host "Pulling latest code..."
git pull origin main

# 3. Install JS dependencies
Write-Host "Installing npm dependencies..."
npm install

# 4. Build APK using Gradle
Write-Host "Building APK..."
Set-Location "$projectDir\android"
.\gradlew assembleDebug

# 5. Detect connected Android devices
$devices = adb devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "No connected Android devices found. Connect a device and try again."
    exit 1
}

# 6. Install APK on all connected devices
$apkPath = "$projectDir\android\app\build\outputs\apk\debug\app-debug.apk"
foreach ($device in $devices) {
    $deviceId = ($device -split "`t")[0]
    Write-Host "Installing APK on device: $deviceId"
    adb -s $deviceId install -r $apkPath
}

Write-Host "APK installed successfully on all connected devices!"
