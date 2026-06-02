# TxTt-Android

Android-bygg av **TxTt**-meldingsappen, pakket med [Capacitor](https://capacitorjs.com).
Capacitor legger React/Vite-web-appen inn i et native Android-skall (WebView) slik at
den kan bygges til en `.apk` og installeres på Android-telefoner.

- **App-ID:** `com.txtt.app`
- **App-navn:** TxTt
- **Mål-Android:** 13 (minSdk 33) og 14 (target/compile 34)

> Repoet inneholder bare kildekode – ingen `node_modules` og ingen `android/`-mappe.
> Begge deler lages automatisk av byggeskriptene / arbeidsflyten under.

---

## Tre måter å få en APK

### 1) Last ned ferdig APK fra GitHub Actions (ingen verktøy lokalt)

Hver push til `main` bygger en APK automatisk i skyen.

1. Gå til **Actions**-fanen i repoet.
2. Åpne siste **Build Android APK**-kjøring.
3. Last ned artifact-en **TxTt-debug-apk** nederst.

Vil du starte et bygg manuelt: Actions ▸ Build Android APK ▸ **Run workflow**.

### 2) Bygg lokalt på Windows

1. Installer **Node.js** (https://nodejs.org) og **Android Studio**
   (https://developer.android.com/studio).
2. Klon eller last ned repoet.
3. Dobbeltklikk **`build-android.bat`**.
4. Bygg APK: `npx cap open android` (Android Studio) **eller**
   `cd android && gradlew.bat assembleDebug`.

### 3) Bygg lokalt på Mac / Linux

1. Installer **Node.js** og **Android Studio**.
2. Klon repoet.
3. Kjør:

   ```bash
   chmod +x build-android.sh
   ./build-android.sh
   ```
4. Bygg APK: `npx cap open android` **eller** `cd android && ./gradlew assembleDebug`.

**Ferdig APK havner her:**

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Kopier den til en Android-telefon (13/14) og installer (tillat «ukjente kilder»).

---

## Supabase-nøkler (backend)

Appen snakker med Supabase. Du bruker dine egne nøkler:

- **Lokalt bygg:** lag en fil `.env.local` (se `.env.example`) med:

  ```
  VITE_SUPABASE_URL=https://ditt-prosjekt.supabase.co
  VITE_SUPABASE_ANON_KEY=din_anon_key
  ```

- **Sky-bygg (Actions):** legg de samme verdiene som repo-**Secrets**
  (`Settings ▸ Secrets and variables ▸ Actions`):
  `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY`.
  Uten secrets bygges appen fortsatt, men uten fungerende backend.

`.env.local` er holdt utenfor Git (`.gitignore`).

---

## Kjent begrensning: innlogging

Google/Apple-innlogging bruker en web-redirect (`window.location.origin`) som ikke
fungerer rett ut av boksen inne i en APK. **E-post/SMS-engangskode virker.**
Sosial innlogging kan kobles på senere med Android App Links (deep links).

---

## Lisens

Se `LICENSE` i hovedprosjektet. Proprietær – all rett forbeholdt.
