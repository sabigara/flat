import { Markup } from "@camome/core/Markup";
import clsx from "clsx";
import { useAtom } from "jotai";
import { Trans, useTranslation } from "react-i18next";

import { AccountList } from "@/src/app/account/components/AccountList";
import { LoginForm } from "@/src/app/account/components/LoginForm";
import { useOnSwitchAccount } from "@/src/app/account/hooks/useOnSwitchAccount";
import { sessionsAtom } from "@/src/app/account/states/atp";
import LogoIcon from "@/src/assets/icon.svg";
import { config } from "@/src/config";
import { externalLinkAttrs } from "@/src/lib/html";

import styles from "./LoginRoute.module.scss";

export function LoginRoute() {
  const { t } = useTranslation();
  const [sessions] = useAtom(sessionsAtom);
  const hasAccount = Object.keys(sessions.accounts).length > 0;
  const handleSwitchAccount = useOnSwitchAccount({
    goHome: true,
  });

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </div>
      <div className={styles.content}>
        <div className={styles.formSection}>
          {!hasAccount && <About />}
          <LoginForm className={styles.form} />
        </div>

        {hasAccount && (
          <div className={styles.accountsSection}>
            <About />
            <div className={styles.accounts}>
              <h2 className={styles.accounts__title}>
                {t("auth.signed-in-accounts")}
              </h2>
              <AccountList
                onSwitchAccount={handleSwitchAccount}
                showLogOut={false}
                showAdd={false}
                disableLoggedIn={false}
                className={styles.accounts__list}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function About({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const aboutUrl =
    i18n.resolvedLanguage === "ja" ? config.aboutUrl.ja : config.aboutUrl.en;
  return (
    <Markup className={clsx(styles.about, styles.prose, className)}>
      <p className={styles.description}>
        <Trans
          i18nKey="auth.about.description"
          components={{
            anchor: <a href="https://bsky.app" {...externalLinkAttrs} />,
          }}
        />
      </p>
      <ul>
        <li>
          <Trans
            i18nKey="auth.about.app-password"
            components={{
              anchor: (
                <a
                  href="https://staging.bsky.app/settings/app-passwords"
                  {...externalLinkAttrs}
                />
              ),
            }}
          />
        </li>
        <li>
          <Trans
            i18nKey="auth.about.external-page"
            components={{
              anchor: <a href={aboutUrl} {...externalLinkAttrs} />,
            }}
          />
        </li>
      </ul>
    </Markup>
  );
}
