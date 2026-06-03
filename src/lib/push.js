import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "./supabase";

const IS_NATIVE = Capacitor?.isNativePlatform?.() === true;

// Registrerer enheten for FCM-push og lagrer token i Supabase (device_tokens)
// knyttet til innlogget bruker, slik at backend kan sende anrops-varsler hit.
// onCallTapped(data) kalles naar brukeren trykker paa et anrops-varsel (app i
// bakgrunn/lukket). No-op paa web (push haandteres kun i den native APK-en).
export async function registerPushForUser(userId, { onCallTapped } = {}) {
  if (!IS_NATIVE || !userId) return;

  // Android 13+ krever runtime-tillatelse (viser systemdialog).
  let perm = await PushNotifications.checkPermissions();
  if (perm.receive === "prompt" || perm.receive === "prompt-with-rationale") {
    perm = await PushNotifications.requestPermissions();
  }
  if (perm.receive !== "granted") {
    console.warn("[Push] varsel-tillatelse ikke gitt:", perm.receive);
    return;
  }

  // Hoy-prioritets varselkanal for anrop (maa matche channel_id i Edge Function).
  try {
    await PushNotifications.createChannel({
      id: "incoming_calls",
      name: "Innkommende anrop",
      description: "Varsler om innkommende tale-/videoanrop",
      importance: 5, // HIGH - heads-up + lyd
      sound: "default",
      vibration: true,
      visibility: 1,
    });
  } catch (e) {
    console.warn("[Push] createChannel feilet:", e?.message ?? e);
  }

  // Unngaa duplikate listeners hvis registrering kjorer paa nytt.
  await PushNotifications.removeAllListeners();

  // Bruker trykket paa anrops-varselet -> aapne anrops-skjermen.
  PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
    const data = action?.notification?.data ?? {};
    console.log("[Push] varsel trykket:", data);
    if (data.type === "incoming_call" && onCallTapped) {
      onCallTapped({
        conversationId: data.conversationId,
        callerName: data.callerName,
        isVideo: data.isVideo === "true",
      });
    }
  });

  PushNotifications.addListener("registration", async (token) => {
    console.log("[Push] FCM-token mottatt, lagrer i Supabase");
    const { error } = await supabase.from("device_tokens").upsert(
      {
        user_id: userId,
        token: token.value,
        platform: "android",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,token" },
    );
    if (error) console.error("[Push] kunne ikke lagre token:", error.message);
  });

  PushNotifications.addListener("registrationError", (err) => {
    console.error("[Push] registrationError:", err);
  });

  await PushNotifications.register();
}
