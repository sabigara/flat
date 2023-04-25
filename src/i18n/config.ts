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

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,
    debug: import.meta.env.DEV,
    fallbackLng: import.meta.env.DEV ? "dev" : "en",
    interpolation: {
      // It's safe to turn off escape according to the docs and an official example:
      // - https://react.i18next.com/getting-started#basic-sample
      // - https://github.com/i18next/react-i18next/blob/master/example/react/src/i18n.js#L22
      escapeValue: false,
    },
  });
