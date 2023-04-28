import { Button } from "@camome/core/Button";
import { Input } from "@camome/core/Input";
import { Spinner } from "@camome/core/Spinner";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation, Form, useLocation } from "react-router-dom";

import LogoIcon from "@/src/assets/icon.svg";

import styles from "./LoginRoute.module.scss";

export function LoginRoute() {
  const { t } = useTranslation();
  const { state } = useNavigation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </div>
      <Form method="post" className={styles.form}>
        <Input
          label="Server"
          name="service"
          type="url"
          defaultValue={searchParams.get("service") ?? undefined}
          required
        />
        <Input
          label={t("auth.identifier.label")}
          name="identifier"
          type="text"
          placeholder="you.bsky.social"
          defaultValue={searchParams.get("identifier") ?? undefined}
          required
        />
        <Input
          label={t("auth.password.label")}
          description={
            <span className={styles.passwordDescription}>
              <Trans
                i18nKey="auth.password.description"
                components={{
                  anchor: (
                    <a
                      href="https://staging.bsky.app/settings/app-passwords"
                      rel="noreferrer noopener"
                      target="_blank"
                    />
                  ),
                }}
              />
            </span>
          }
          name="password"
          type="password"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          pattern={`.{4}-.{4}-.{4}-.{4}`} // TODO: is there any way to convert a RegExp to string?
          required
        />
        <Button
          type="submit"
          disabled={state === "submitting"}
          startDecorator={
            state === "submitting" ? <Spinner size="sm" /> : undefined
          }
        >
          {t("auth.sign-in")}
        </Button>
      </Form>
    </div>
  );
}
