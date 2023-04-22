import { Button } from "@camome/core/Button";
import { Input } from "@camome/core/Input";
import { Spinner } from "@camome/core/Spinner";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useNavigation,
} from "react-router-dom";

import { appPasswordRegex } from "@/src/app/account/lib/appPassword";
import LogoIcon from "@/src/assets/icon.svg";
import { atp } from "@/src/lib/atp";

import styles from "./index.module.scss";

export const loader = (async () => {
  // TODO: always !atp.hasSession for first visit
  if (atp.hasSession) return redirect("/");
  return null;
}) satisfies LoaderFunction;

export const action = (async ({ request }) => {
  const data = await request.formData();
  const identifier = data.get("identifier");
  const password = data.get("password");
  // TODO: better validation?
  if (
    typeof identifier !== "string" ||
    typeof password !== "string" ||
    !password.match(appPasswordRegex)
  ) {
    throw new Error(`Validation error: ${{ identifier, password }}`);
  }
  const resp = await atp.login({
    identifier: identifier,
    password: password,
  });
  if (!resp.success) {
    throw new Error("Login failed.");
  }
  // TODO: redirect has response?
  redirect("/");
  return null;
}) satisfies ActionFunction;

export const element = <LoginRoute />;

function LoginRoute() {
  const { state } = useNavigation();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </div>
      <Form method="post" className={styles.form}>
        <Input
          label="ハンドルまたはメールアドレス"
          name="identifier"
          type="text"
          placeholder="you.bsky.social"
          required
        />
        <Input
          label="パスワード"
          description={
            <span className={styles.passwordDescription}>
              <a
                href="https://staging.bsky.app/settings/app-passwords"
                rel="noreferrer noopener"
                target="_blank"
              >
                アプリパスワードを生成
              </a>
              して入力してください
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
          ログイン
        </Button>
      </Form>
    </div>
  );
}
