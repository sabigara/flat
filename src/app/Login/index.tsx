import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { TextInput } from "@camome/core/TextInput";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useNavigation,
} from "react-router-dom";

import LogoIcon from "@/src/assets/icon.svg";
import { atp } from "@/src/lib/atp/atp";

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
  if (typeof identifier !== "string" || typeof password !== "string") {
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
        <TextInput
          label="Identifier (handle or email)"
          name="identifier"
          type="text"
          placeholder="you.bsky.social"
        />
        <TextInput label="Password" name="password" type="password" />
        <Button
          type="submit"
          disabled={state === "submitting"}
          startDecorator={
            state === "submitting" ? <Spinner size="sm" /> : undefined
          }
        >
          ログイン
        </Button>
        <small className={styles.notice}>
          Flatはまだ開発中です。セキュリティなどに不安を覚える人はログインしないでください。
        </small>
      </Form>
    </div>
  );
}
