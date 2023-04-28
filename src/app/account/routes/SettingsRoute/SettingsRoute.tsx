import { Select } from "@camome/core/Select";
import { useImmerAtom } from "jotai-immer";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import type { RootContext } from "@/src/app/root/routes/RootRoute/RootRoute";
import type { Theme } from "@/src/app/theme/lib/types";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { PostImageLayout } from "@/src/app/post/lib/types";
import Seo from "@/src/app/seo/Seo";

import styles from "./SettingsRoute.module.scss";

export function SettingsRoute() {
  const { t, i18n } = useTranslation("settings");
  const [settings, setSettings] = useImmerAtom(settingsAtom);
  const { theme } = useOutletContext<RootContext>();

  return (
    <>
      <Seo title={t("title")} />
      <div className={styles.container}>
        <h1 className={styles.title}>{t("title")}</h1>

        <section className={styles.section}>
          <h2>{t("appearance.title")}</h2>
          <Select
            label={t("appearance.theme.title")}
            size="md"
            value={theme.value}
            onChange={(e) => theme.set(e.target.value as Theme)}
          >
            <option value="light">{t("appearance.theme.options.light")}</option>
            <option value="dark">{t("appearance.theme.options.dark")}</option>
            <option value="system">
              {t("appearance.theme.options.system")}
            </option>
          </Select>

          <Select
            label={t("appearance.image-layout.title")}
            size="md"
            value={settings.postImageLayout}
            onChange={(e) =>
              setSettings(
                (draft) =>
                  void (draft.postImageLayout = e.target
                    .value as PostImageLayout)
              )
            }
          >
            <option value="stack">
              {t("appearance.image-layout.options.stack")}
            </option>
            <option value="compact">
              {t("appearance.image-layout.options.compact")}
            </option>
          </Select>
        </section>

        <section className={styles.section}>
          <h2>{t("language.title")}</h2>
          <Select
            label={t("language.title")}
            size="md"
            value={i18n.resolvedLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </Select>
        </section>
      </div>
    </>
  );
}
