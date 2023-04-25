import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "./en/common.json";
import enNotif from "./en/notification.json";
import enSettings from "./en/settings.json";
import enUsers from "./en/users.json";
import jaCommon from "./ja/common.json";
import jaNotif from "./ja/notification.json";
import jaSettings from "./ja/settings.json";
import jaUsers from "./ja/users.json";

export const defaultNS = "common";

export const resources = {
  en: {
    common: enCommon,
    notification: enNotif,
    settings: enSettings,
    users: enUsers,
  },
  ja: {
    common: jaCommon,
    notification: jaNotif,
    settings: jaSettings,
    users: jaUsers,
  },
} as const;

i18next.use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  resources,
  defaultNS,
});
