import { Button } from "@camome/core/Button";
import { Input } from "@camome/core/Input";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useAtom } from "jotai";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { useOnSwitchAccount } from "@/src/app/account/hooks/useOnSwitchAccount";
import { loginWithPersist } from "@/src/app/account/states/atp";
import {
  LoginFormData,
  loginFormDataAtom,
  resetLoginFormData,
} from "@/src/app/account/states/loginFormAtom";
import { isButtonLoading } from "@/src/components/isButtonLoading";
import { externalLinkAttrs } from "@/src/lib/html";

import styles from "./LoginForm.module.scss";

type Props = {
  className?: string;
};

export function LoginForm({ className }: Props) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useAtom(loginFormDataAtom);
  const { service, identifier, password } = formValues;
  const handleSwitchAccount = useOnSwitchAccount({
    goHome: true,
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormValues((draft) => {
      draft[e.target.name as keyof LoginFormData] = e.target.value;
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async (params: { values: LoginFormData }) => {
      return loginWithPersist(params.values);
    },
    onSuccess: () => {
      resetLoginFormData();
      handleSwitchAccount({
        isSignIn: true,
      });
    },
  });

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    mutate({ values: formValues });
  };

  React.useEffect(() => {
    return () => {
      setFormValues((curr) => ({
        ...curr,
        password: "",
      }));
    };
  }, [setFormValues]);

  return (
    <form onSubmit={handleSubmit} className={clsx(styles.container, className)}>
      <Input
        label={t("auth.service.label")}
        name="service"
        type="url"
        onChange={handleChange}
        value={service}
        required
      />
      <Input
        label={t("auth.identifier.label")}
        name="identifier"
        type="text"
        placeholder="you.bsky.social"
        onChange={handleChange}
        value={identifier}
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
                    href="https://bsky.app/settings/app-passwords"
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
        onChange={handleChange}
        value={password}
        pattern={`.{4}-.{4}-.{4}-.{4}`} // TODO: is there any way to convert a RegExp to string?
        required
      />
      <Button type="submit" {...isButtonLoading(isLoading)}>
        {t("auth.sign-in")}
      </Button>
    </form>
  );
}
