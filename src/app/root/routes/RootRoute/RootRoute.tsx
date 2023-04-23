import React from "react";
import { Outlet, useLoaderData, ScrollRestoration } from "react-router-dom";

import { useClearNotifQueryData } from "@/src/app/notification/hooks/useClearNotifQueryData";
import Header from "@/src/app/root/components/Header";
import { useTheme } from "@/src/app/theme/hooks/useTheme";
import { Theme } from "@/src/app/theme/lib/types";

import "@/src/lib/intl-segmenter-polyfill.min.js";
import styles from "./RootRoute.module.scss";

export function RootRoute() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const { theme: loadedTheme } = useLoaderData() as {
    theme: Theme;
  };
  const { setTheme, theme, resolvedTheme } = useTheme(loadedTheme);

  const rootContext: RootContext = {
    theme: {
      value: theme,
      set: setTheme,
    },
  };

  useClearNotifQueryData();

  React.useLayoutEffect(() => {
    window.document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return (
    <>
      <ScrollRestoration />
      <div className={styles.container}>
        <Header />
        <main>
          <Outlet context={rootContext} />
        </main>
      </div>
    </>
  );
}

export type RootContext = {
  theme: {
    value: Theme;
    set: (theme: Theme) => void;
  };
};
