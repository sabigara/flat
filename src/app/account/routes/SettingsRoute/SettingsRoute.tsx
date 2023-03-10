import { Button } from "@camome/core/Button";
import { Select } from "@camome/core/Select";
import { Spinner } from "@camome/core/Spinner";
import React from "react";
import { useOutletContext } from "react-router-dom";

import type { RootContext } from "@/src/app/root/routes/RootRoute/RootRoute";
import type { Theme } from "@/src/app/theme/lib/types";

import Seo from "@/src/app/seo/Seo";
import { storageKeys } from "@/src/lib/storage";

import styles from "./SettingsRoute.module.scss";

export function SettingsRoute() {
  const { theme } = useOutletContext<RootContext>();
  const [signingOut, setSigningOut] = React.useState(false);
  const signOut = () => {
    setSigningOut(true);
    try {
      localStorage.removeItem(storageKeys.session.$);
      window.location.reload();
    } catch (e) {
      console.error(e);
      setSigningOut(false);
    }
  };
  return (
    <>
      <Seo title="ユーザー設定" />
      <div className={styles.container}>
        <h1 className={styles.title}>ユーザー設定</h1>

        <section className={styles.section}>
          <h2>外観</h2>
          <Select
            label="テーマ"
            size="md"
            value={theme.value}
            onChange={(e) => theme.set(e.target.value as Theme)}
          >
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
            <option value="system">システム</option>
          </Select>
        </section>

        <section className={styles.section}>
          <h2>アカウント</h2>
          <Button
            onClick={signOut}
            variant="soft"
            colorScheme="neutral"
            startDecorator={signingOut ? <Spinner size="sm" /> : false}
            disabled={signingOut}
          >
            ログアウト
          </Button>
        </section>
      </div>
    </>
  );
}
