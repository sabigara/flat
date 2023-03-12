import React from "react";
import {
  Outlet,
  useLoaderData,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";

import PostComposer from "@/src/app/post/components/PostComposer";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { feedItemToUniqueKey } from "@/src/app/post/lib/feedItemToUniqueKey";
import Header from "@/src/app/root/components/Header";
import { useTheme } from "@/src/app/theme/hooks/useTheme";
import { Theme } from "@/src/app/theme/lib/types";

import styles from "./RootRoute.module.scss";

const composeButtonHideRoutes = [
  "/settings",
  "/about",
  "/notifications",
  /^\/[^/]*\/(followers|following)/,
];

export function RootRoute() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const { theme: loadedTheme } = useLoaderData() as {
    theme: Theme;
  };
  const { setTheme, theme, resolvedTheme } = useTheme(loadedTheme);
  const location = useLocation();
  const { replyTarget } = usePostComposer();

  const rootContext: RootContext = {
    theme: {
      value: theme,
      set: setTheme,
    },
  };

  React.useLayoutEffect(() => {
    window.document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return (
    <>
      <ScrollRestoration />
      <div className={styles.container}>
        <Header />
        <main>
          <PostComposer
            showButton={
              !composeButtonHideRoutes.some((path) =>
                location.pathname.match(path)
              )
            }
            // keep it's internal state until replyTarget changes or removed.
            // TODO: more performant way?
            key={replyTarget && feedItemToUniqueKey(replyTarget)}
          />
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
