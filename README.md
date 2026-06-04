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

## Egen Supabase-backend (in-app «READ CAREFULLY»-notisen)

Første gang noen åpner TxTt – før de registrerer seg – vises en engangs-notis kalt
**«READ CAREFULLY»** (og en tilsvarende **«Create your own free Supabase backend →»**-lenke
på login-skjermen). Slik henger det sammen:

- TxTt er **gratis å bruke**. Hver konto får inntil **5 GB lagring** på den delte
  backend-en som Eieren drifter – uten kostnad, uten abonnement.
- Vil noen ha **mer plass og fullt eierskap til egne data**, kan de kjøre TxTt på
  **sin egen gratis Supabase-backend**.
- Vil de ikke bry seg, trykker de bare **Continue** og fortsetter på den delte
  backend-en (Eierens credentials). Det er helt greit og er standardvalget.

> ⚠️ **Ærlig forventningsstyring:** Å opprette en Supabase-*konto* tar ~2 minutter, men
> å faktisk koble appen til din egen backend er en **engangs-oppsettjobb for utvikler** –
> det finnes **ingen «lim inn URL/nøkkel»-knapp inne i appen i dag**. Hele backend-en
> (databaseskjema, row-level security, evt. Edge Function) må settes opp én gang. I praksis
> bruker derfor de aller fleste den delte backend-en; notisen finnes for å *tilby*
> selvhosting og gjøre valget tydelig.

### Slik setter du opp din egen backend

1. Opprett et gratis Supabase-prosjekt på **[supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up)**.
2. Kopier **Project URL** og **anon (publishable) key** fra **Project Settings → API**,
   og noter **project ref** og **database-passord**.
3. Legg URL + anon key i `.env.local` (lokalt bygg) eller som repo-**Secrets** for
   sky-bygget – se «Supabase-nøkler (backend)» over.
4. Kjør databaseskjemaet i web-prosjektet (`TxTt`-repoet): `supabase db push`
   (lager alle tabeller + row-level security).
5. *(Valgfritt)* Deploy AI-assistentens Edge Function og sett Anthropic-secret.

Etterpå snakker appen **kun med ditt prosjekt**, og alle data ligger i **din** database –
ingen andre ser dem.

> 💡 **Skriv ned detaljene dine.** Når du oppretter prosjektet, ta vare på **Project URL**,
> **anon key**, **database-passord** og **project ref** et trygt sted – en **Notisblokk**-fil
> eller et **Word**-dokument holder helt fint. Du trenger dem igjen til stegene over og hvis
> du noen gang kloner repoet på nytt.

---

## Kjent begrensning: innlogging

Google/Apple-innlogging bruker en web-redirect (`window.location.origin`) som ikke
fungerer rett ut av boksen inne i en APK. **E-post/SMS-engangskode virker.**
Sosial innlogging kan kobles på senere med Android App Links (deep links).

---

## Lisens

MIT – se [`LICENSE`](LICENSE). Fritt å bruke, endre og distribuere.

**Kontakt:** Hollman Rivero · hollman.rivero@bygg-salazar.no · [WhatsApp](https://wa.me/4793672121)
