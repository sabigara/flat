import { Button } from "@camome/core/Button";
import { Input } from "@camome/core/Input";
import { Spinner } from "@camome/core/Spinner";
import clsx from "clsx";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation, Form, useLocation } from "react-router-dom";

import { externalLinkAttrs } from "@/src/lib/html";

import styles from "./LoginForm.module.scss";

type Props = {
  className?: string;
};

export function LoginForm({ className }: Props) {
  const { t } = useTranslation();
  const { state } = useNavigation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  return (
    <Form method="post" className={clsx(styles.container, className)}>
      <Input
        label={t("auth.service.label")}
        name="service"
        type="url"
        defaultValue={searchParams.get("service") ?? "https://bsky.social"}
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
                    {...externalLinkAttrs}
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
  );
}
