import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import "./index.css";
import App from "./App.jsx";
import { supabase } from "./lib/supabase";

// StrictMode fjernet bevisst: React's dev-only double-mount feature
// rev WebRTC-sessions ned for fort. Komponenter som setter opp tunge
// ressurser (kamera, peer connections) toler ikke unmount-remount.
createRoot(document.getElementById("root")).render(<App />);

// ─── OAuth deep link handler (kun pa Android/iOS APK) ───────────────────────
// Naar Google/Apple OAuth redirecter til com.txtt.app://auth/callback,
// fanger Android den og leverer URL-en til appen via 'appUrlOpen'-eventet.
if (Capacitor?.isNativePlatform?.()) {
  CapApp.addListener("appUrlOpen", async (event) => {
    const incomingUrl = event?.url || "";
    console.log("[DeepLink] appUrlOpen:", incomingUrl);

    if (!incomingUrl.includes("auth/callback")) return;

    try {
      const urlObj = new URL(incomingUrl);

      // PKCE-flow: ?code=xxx i query string
      const code = urlObj.searchParams.get("code");
      if (code) {
        console.log("[DeepLink] PKCE-flow - exchangeCodeForSession");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error("[DeepLink] exchangeCodeForSession feilet:", error);
      } else if (urlObj.hash) {
        // Implicit flow: #access_token=xxx&refresh_token=xxx i fragment
        console.log("[DeepLink] Implicit flow - setSession fra fragment");
        const params = new URLSearchParams(urlObj.hash.replace(/^#/, ""));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) console.error("[DeepLink] setSession feilet:", error);
        }
      }
    } catch (err) {
      console.error("[DeepLink] feil ved parsing av URL:", err);
    } finally {
      // Lukk system-browser-en saa brukeren er tilbake i appen
      try { await Browser.close(); } catch {}
    }
  });
}
