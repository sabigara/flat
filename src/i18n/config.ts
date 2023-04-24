import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import enCommon from "./en/common.json";
import jaCommon from "./ja/common.json";

export const defaultNS = "common";

export const resources = {
  en: {
    common: enCommon,
  },
  ja: {
    common: jaCommon,
  },
} as const;

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources,
    defaultNS,
    ns: ["common"],
  });
