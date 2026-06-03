import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

// ─── Replace these with your actual values (use import.meta.env in production) ───
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://api.yourdomain.com";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your_anon_key_here";

// Inni Capacitor (Android/iOS APK) bruker vi custom URL scheme,
// for ellers vil OAuth redirecte til https://localhost som ikke finnes paa telefonen.
const IS_NATIVE = Capacitor?.isNativePlatform?.() === true;
const OAUTH_REDIRECT = IS_NATIVE
  ? "com.txtt.app://auth/callback"
  : `${window.location.origin}/auth/callback`;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // I native app handler vi sessions manuelt via deep link (se main.jsx).
    // Paa web bruker vi automatisk URL-deteksjon.
    detectSessionInUrl: !IS_NATIVE,
    flowType: IS_NATIVE ? "pkce" : "implicit",
  },
});

// ── Auth helpers ──────────────────────────────────────────────────────────────

/** Sign in with Google — opens OAuth popup/redirect (web) or system browser (native) */
export const signInWithGoogle = async () => {
  if (IS_NATIVE) {
    // Paa Android: hent OAuth-URL fra Supabase, aapne i system-browser
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: OAUTH_REDIRECT,
        skipBrowserRedirect: true,
      },
    });
    if (error) return { error };
    if (data?.url) await Browser.open({ url: data.url });
    return { error: null };
  }
  // Paa web: vanlig redirect-flow
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: OAUTH_REDIRECT },
  });
};

/** Sign in with Apple — same Capacitor-aware flow */
export const signInWithApple = async () => {
  if (IS_NATIVE) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: OAUTH_REDIRECT,
        skipBrowserRedirect: true,
      },
    });
    if (error) return { error };
    if (data?.url) await Browser.open({ url: data.url });
    return { error: null };
  }
  return supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: OAUTH_REDIRECT },
  });
};

/** Send email OTP (6-digit code to email) */
export const sendEmailOTP = (email) =>
  supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

/** Send phone OTP via Twilio */
export const sendPhoneOTP = (phone) =>
  supabase.auth.signInWithOtp({
    phone, // Must be E.164 format: +4712345678
    options: { shouldCreateUser: true },
  });

/** Verify OTP (works for both email and phone) */
export const verifyOTP = ({ email, phone, token }) => {
  if (email) {
    return supabase.auth.verifyOtp({ email, token, type: "email" });
  }
  return supabase.auth.verifyOtp({ phone, token, type: "sms" });
};

/** Register with email + password (no OTP — Supabase sends confirmation link) */
export const signUpWithEmailPassword = (email, password) =>
  supabase.auth.signUp({ email, password });

/** Sign in with email + password */
export const signInWithEmailPassword = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

/** Register with phone + password — sends OTP once for verification */
export const signUpWithPhone = (phone, password) =>
  supabase.auth.signUp({ phone, password });

/** Sign in with phone + password — no OTP, direct login */
export const signInWithPhone = (phone, password) =>
  supabase.auth.signInWithPassword({ phone, password });

/** Send password reset email — link redirects to /auth/reset */
export const resetPasswordByEmail = (email) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  });

/** Sign out */
export const signOut = () => supabase.auth.signOut();

/** Get current session */
export const getSession = () => supabase.auth.getSession();

/** Subscribe to auth state changes */
export const onAuthStateChange = (callback) =>
  supabase.auth.onAuthStateChange(callback);
