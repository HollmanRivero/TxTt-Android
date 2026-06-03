@echo off
title TxTt - Bygg Android APK
color 0B
setlocal

REM ============================================
REM  TxTt Android - bygg APK paa Windows
REM  Kjorer: npm install -> vite build -> cap add/sync
REM  Krever: Node.js og Android Studio installert
REM ============================================

cd /d "%~dp0"

echo.
echo  ============================================
echo   TxTt Android - bygg APK
echo   Mappe: %CD%
echo  ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo  [FEIL] Node.js er ikke installert / ikke i PATH.
    echo  Installer Node.js fra https://nodejs.org foerst.
    pause
    exit /b 1
)

echo  [1/6] npm install ...
call npm install
if errorlevel 1 ( echo  [FEIL] npm install feilet. & pause & exit /b 1 )

echo.
echo  [2/6] Bygger web-appen (vite build) ...
call npm run build
if errorlevel 1 ( echo  [FEIL] build feilet. & pause & exit /b 1 )

echo.
echo  [3/6] Legger til Android-plattform (hvis den mangler) ...
if not exist "android" (
    call npx cap add android
    if errorlevel 1 ( echo  [FEIL] cap add android feilet. & pause & exit /b 1 )
) else (
    echo  android-mappen finnes allerede - hopper over cap add.
)

echo.
echo  [4/6] Setter SDK-nivaa: minSdk 33 (Android 13), target/compile 35 (Android 15) ...
powershell -NoProfile -Command "$f='android\variables.gradle'; if (Test-Path $f) { (Get-Content $f) -replace 'minSdkVersion = \d+','minSdkVersion = 33' -replace 'compileSdkVersion = \d+','compileSdkVersion = 35' -replace 'targetSdkVersion = \d+','targetSdkVersion = 35' | Set-Content $f }"

echo.
echo  [5/6] Genererer Android-ikon og splash screen fra resources/ ...
if exist "resources\icon.png" (
    call npx capacitor-assets generate --android
    if errorlevel 1 ( echo  [ADVARSEL] capacitor-assets feilet - APK far default-ikon. )
) else (
    echo  resources\icon.png mangler - hopper over asset-generering.
)

echo.
echo  [6/6] Synker web-appen inn i Android-prosjektet (cap sync) ...
call npx cap sync android
if errorlevel 1 ( echo  [FEIL] cap sync feilet. & pause & exit /b 1 )

echo.
echo  ============================================
echo   FERDIG med oppsett.
echo.
echo   Bygg APK paa en av to maater:
echo.
echo   A) Android Studio:
echo        npx cap open android
echo      ...og trykk Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo.
echo   B) Kommandolinje (uten aa aapne Android Studio):
echo        cd android
echo        gradlew.bat assembleDebug
echo.
echo   Ferdig APK havner her:
echo        android\app\build\outputs\apk\debug\app-debug.apk
echo  ============================================
echo.
pause
