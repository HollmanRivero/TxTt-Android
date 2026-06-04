# Oppsett etter kloning (TxTt-Android)

Hele `android/`-prosjektet ligger nå i git, så native-tilpasninger (kamera/mikrofon-
tillatelser, push, edge-to-edge-fiks, signering) overlever kloning. **Men to
hemmelige filer er holdt utenfor git** og MÅ legges tilbake manuelt etter en fersk
kloning, ellers feiler bygg/innlogging:

## 1. `android/keystore.properties` (for å signere release-.aab)
Opprett fila `android/keystore.properties` med:
```
storeFile=C:/Users/river/Documents/Secrets/txtt-upload-keystore.jks
storePassword=<se Secrets/txtt-keystore-INFO.txt>
keyAlias=txtt-upload
keyPassword=<se Secrets/txtt-keystore-INFO.txt>
```
Selve nøkkelen (`txtt-upload-keystore.jks`) ligger i `Documents\Secrets` — IKKE i git.
(Trengs kun for `bundleRelease`/`assembleRelease`, ikke for debug-APK.)

## 2. `android/app/google-services.json` (for FCM push)
Kopier `google-services.json` fra backup (`Documents\Secrets`) eller last ned på nytt
fra Firebase Console → Project settings → Your apps → TxTt (`com.txtt.app`).

## 3. `frontend/.env.local` (Supabase + TURN-nøkler)
Se `frontend/.env.example`. Må ha `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
(+ `VITE_METERED_API_URL`/`VITE_METERED_API_KEY` for samtaler).

## Deretter: bygg
```
build-android.bat           (npm install + vite build + ikon/splash + cap sync)
cd android
gradlew.bat assembleDebug   (debug-APK)   ELLER   gradlew.bat bundleRelease (.aab for Play)
```
