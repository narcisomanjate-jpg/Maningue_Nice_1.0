param(
  [ValidateSet('debug','release')]
  [string]$Mode = 'debug',
  [switch]$Install
)

Set-StrictMode -Version Latest

function Info($m){ Write-Host "[INFO] " -ForegroundColor Cyan -NoNewline; Write-Host $m }
function Ok($m){ Write-Host "[OK]   " -ForegroundColor Green -NoNewline; Write-Host $m }
function Err($m){ Write-Host "[ERR]  " -ForegroundColor Red -NoNewline; Write-Host $m }

Info "Preparing web build and copying to Android (npm run android:prepare)..."
& npm run android:prepare
if ($LASTEXITCODE -ne 0) { Err "npm run android:prepare failed (exit $LASTEXITCODE). Aborting."; exit $LASTEXITCODE }
Ok "Web build copied to Android assets."

Info "Syncing Capacitor Android platform (npx cap sync android)..."
# Ensure Capacitor CLI is available (prefer local install)
$localCapCmd = Join-Path (Join-Path (Get-Location) 'node_modules') '.bin\cap'
if (-not (Test-Path $localCapCmd) -and -not (Get-Command npx -ErrorAction SilentlyContinue)) {
  Err "Capacitor CLI not found. Instale localmente e tente novamente: npm install @capacitor/cli @capacitor/core --save-dev"; exit 1
}

# Attempt to run cap via local binary or npx
if (Test-Path $localCapCmd) {
  & $localCapCmd 'sync' 'android'
} else {
  $npxCmd = Get-Command npx -ErrorAction SilentlyContinue
  if (-not $npxCmd) { $npxCmd = Get-Command 'npx.cmd' -ErrorAction SilentlyContinue }
  if ($npxCmd) {
  # Some Windows installations of npx expect to run under cmd.exe
  try {
    & $npxCmd 'cap' 'sync' 'android'
  } catch {
    # fallback to running via cmd.exe
    Start-Process -FilePath cmd.exe -ArgumentList '/c','npx cap sync android' -NoNewWindow -Wait -PassThru | Out-Null
  }
  } else {
    # try npm exec as a last resort
    Info "npx not available or failed. Trying 'npm exec -- cap sync android'..."
    & npm exec -- cap sync android
    if ($LASTEXITCODE -ne 0) { Err "Capacitor sync failed. Instale @capacitor/cli (@capacitor/core) ou use 'npx cap sync android' manualmente."; exit 1 }
  }
}
}
if ($LASTEXITCODE -ne 0) { Err "npx cap sync android failed (exit $LASTEXITCODE). Aborting."; exit $LASTEXITCODE }
Ok "Capacitor sync complete."

# Locate gradlew
$gradlewWin = Join-Path (Join-Path (Get-Location) 'android') 'gradlew.bat'
$gradlewUnix = Join-Path (Join-Path (Get-Location) 'android') 'gradlew'
if (Test-Path $gradlewWin) { $gradleCmd = $gradlewWin } elseif (Test-Path $gradlewUnix) { $gradleCmd = $gradlewUnix } else { Err "Gradle wrapper not found in ./android. Execute 'npx cap add android' first or open Android Studio."; exit 1 }

$task = if ($Mode -eq 'debug') { 'assembleDebug' } else { 'assembleRelease' }
Info "Running Gradle task: $task"
Push-Location android
& $gradleCmd $task
$exitCode = $LASTEXITCODE
Pop-Location
if ($exitCode -ne 0) { Err "Gradle build failed (exit $exitCode)."; exit $exitCode }
Ok "Gradle build successful."

# Find APK
if ($Mode -eq 'debug') {
  $apkCandidate = Join-Path (Join-Path (Get-Location) 'android\app\build\outputs\apk\debug') 'app-debug.apk'
} else {
  $apkCandidateUnsigned = Join-Path (Join-Path (Get-Location) 'android\app\build\outputs\apk\release') 'app-release-unsigned.apk'
  $apkCandidateSigned = Join-Path (Join-Path (Get-Location) 'android\app\build\outputs\apk\release') 'app-release.apk'
  if (Test-Path $apkCandidateSigned) { $apkCandidate = $apkCandidateSigned } else { $apkCandidate = $apkCandidateUnsigned }
}

if (-not (Test-Path $apkCandidate)) {
  Err "APK not found at expected path: $apkCandidate"
  Write-Host "Verifique android/app/build/outputs/apk/ para localizar o apk."
  exit 1
}

Ok "APK localizado: $apkCandidate"

if ($Install.IsPresent) {
  Info "Installing APK on connected device (adb install -r)..."
  $proc = Start-Process -FilePath adb -ArgumentList 'install','-r',$apkCandidate -NoNewWindow -Wait -PassThru
  if ($proc.ExitCode -ne 0) { Err "adb install failed (exit $($proc.ExitCode))."; exit $proc.ExitCode }
  Ok "APK instalado no dispositivo."
}

Write-Host "\nBuild finished. APK: $apkCandidate" -ForegroundColor Cyan
