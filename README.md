# TxTt-Android

Android-bygg av TxTt-meldingsappen, pakket med [Capacitor](https://capacitorjs.com).
Capacitor legger React/Vite-web-appen inn i et native Android-skall (WebView) og
lar deg bygge en `.apk`.

- **App-ID:** `com.txtt.app`
- **App-navn:** TxTt
- **Mål:** Android 13 (minSdk 33) og Android 14 (target/compile 34)

> Dette prosjektet er laget for å bygges på **Windows**. Mappen inneholder bare
> kildekode – ingen `node_modules` og ingen ferdig `android/`-mappe. Begge deler
> lages automatisk når du kjører byggeskriptet under.

## Forutsetninger (på Windows-PC-en)

1. **Node.js** – https://nodejs.org (LTS, f.eks. 20 eller 22)
2. **Android Studio** – https://developer.android.com/studio
   (gir deg Android SDK, JDK og Gradle)

## Bygg APK – enkleste vei

1. Kopier hele `TxTt-Android`-mappen til Windows-PC-en.
2. Dobbeltklikk **`build-android.bat`**.

Skriptet kjører i rekkefølge:

1. `npm install` – henter alle pakker (inkl. Capacitor)
2. `npm run build` – bygger web-appen til `dist/`
3. `npx cap add android` – lager `android/`-prosjektet (kun første gang)
4. setter SDK-nivå til Android 13/14
5. `npx cap sync android` – kopierer web-appen inn i Android-prosjektet

Til slutt bygger du selve APK-en:

**A) I Android Studio:**

```
npx cap open android
```

…og velg **Build ▸ Build Bundle(s) / APK(s) ▸ Build APK(s)**.

**B) Fra kommandolinjen:**

```
cd android
gradlew.bat assembleDebug
```

Ferdig APK havner her:

```
android\app\build\outputs\apk\debug\app-debug.apk
```

Kopier den til Android-telefonen (13/14) og installer (tillat «ukjente kilder»).

## .env.local (Supabase-nøkler)

`.env.local` ligger allerede i mappen og brukes automatisk av `npm run build`.
Den er holdt utenfor Git (`.gitignore`), men følger med når du kopierer mappen fysisk.

## Kjent begrensning: innlogging

Google/Apple-innlogging bruker en web-redirect (`window.location.origin`) som ikke
fungerer rett ut av boksen inne i en APK. **E-post/SMS-engangskode virker.**
Sosial innlogging kan kobles på senere med Android «deep links» (App Links).
