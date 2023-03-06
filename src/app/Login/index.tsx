import { atp } from "@/src/lib/atp/atp";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useNavigation,
} from "react-router-dom";
import { TextInput } from "@camome/core/TextInput";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import LogoIcon from "@/src/assets/icon.svg";

import styles from "./index.module.scss";

export const loader = (async () => {
  // TODO: always !atp.hasSession for first visit
  if (atp.hasSession) return redirect("/");
  return null;
}) satisfies LoaderFunction;

export const action = (async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  // TODO: better validation?
  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error(`Validation error: ${{ email, password }}`);
  }
  const resp = await atp.login({
    identifier: email,
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
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
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
