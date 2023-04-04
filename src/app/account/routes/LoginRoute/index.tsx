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
        <Input
          label="Identifier (handle or email)"
          name="identifier"
          type="text"
          placeholder="you.bsky.social"
          required
        />
        <Input label="Password" name="password" type="password" required />
        <Button
          type="submit"
          startDecorator={
            state === "submitting" ? <Spinner size="sm" /> : undefined
          }
        >
          ログイン
        </Button>

        <small className={styles.notice}>
          FlatはBlueskyサーバーの破壊的変更に対応中です。数日以内には復旧予定です。
        </small>
        <small className={styles.notice}>
          I&apos;m working on migrating to the new AT Protocol which may take a
          few days.
        </small>
      </Form>
    </div>
  );
}
