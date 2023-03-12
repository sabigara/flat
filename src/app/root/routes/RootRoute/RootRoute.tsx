import {
  AtpSessionData,
  AppBskyActorProfile,
  AppBskyFeedFeedViewPost,
} from "@atproto/api";
import React from "react";
import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";

import PostComposer from "@/src/app/post/components/PostComposer";
import { feedItemToUniqueKey } from "@/src/app/post/lib/feedItemToUniqueKey";
import Header from "@/src/app/root/components/Header";
import { useTheme } from "@/src/app/theme/hooks/useTheme";
import { getTheme } from "@/src/app/theme/lib/getTheme";
import { Theme } from "@/src/app/theme/lib/types";

import styles from "./RootRoute.module.scss";

export const loader = (async () => {
  return { theme: getTheme() };
}) satisfies LoaderFunction;

export const element = <RootRoute />;

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
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] =
    React.useState<AppBskyFeedFeedViewPost.Main>();
  const location = useLocation();

  const appContext: RootContext = {
    theme: {
      value: theme,
      set: setTheme,
    },
    composer: {
      open: composerOpen,
      setOpen: setComposerOpen,
      replyTarget,
      setReplyTarget,
      handleClickCompose: () => {
        setReplyTarget(undefined);
        setComposerOpen(true);
      },
      handleClickReply: (feedItem) => {
        setReplyTarget(feedItem);
        setComposerOpen(true);
      },
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
            open={appContext.composer.open}
            setOpen={appContext.composer.setOpen}
            onClickCompose={appContext.composer.handleClickCompose}
            replyTarget={appContext.composer.replyTarget}
            showButton={
              !composeButtonHideRoutes.some((path) =>
                location.pathname.match(path)
              )
            }
            // keep it's internal state until replyTarget changes or removed.
            key={
              appContext.composer.replyTarget &&
              feedItemToUniqueKey(appContext.composer.replyTarget)
            }
          />
          <Outlet context={appContext} />
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
  composer: {
    open: boolean;
    setOpen: (val: boolean) => void;
    replyTarget?: AppBskyFeedFeedViewPost.Main;
    setReplyTarget: (feedItem: RootContext["composer"]["replyTarget"]) => void;
    handleClickCompose: () => void;
    handleClickReply: RootContext["composer"]["setReplyTarget"];
  };
};
