import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import enCommon from "./en/common.json";
import enNotif from "./en/notification.json";
import enSettings from "./en/settings.json";
import jaCommon from "./ja/common.json";
import jaNotif from "./ja/notification.json";
import jaSettings from "./ja/settings.json";

export const defaultNS = "common";

export const resources = {
  en: {
    common: enCommon,
    notification: enNotif,
    settings: enSettings,
  },
  ja: {
    common: jaCommon,
    notification: jaNotif,
    settings: jaSettings,
  },
} as const;

i18next.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  resources,
  defaultNS,
});
