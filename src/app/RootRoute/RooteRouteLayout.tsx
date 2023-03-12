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

import Header from "@/src/components/Header";
import PostComposer from "@/src/components/post/PostComposer";
import { atp, bsky } from "@/src/lib/atp/atp";
import { feedItemToUniqueKey } from "@/src/lib/atp/post";
import { storageKeys } from "@/src/lib/storage";
import { getTheme, Theme, useTheme } from "@/src/lib/theme";

import styles from "./RooteRouteLayout.module.scss";

export const loader = (async () => {
  let theme: Theme = "system";
  if (!atp.hasSession) {
    const sessionStr = localStorage.getItem(storageKeys.session.$);
    if (!sessionStr) return redirect("/login");
    const session = JSON.parse(sessionStr) as AtpSessionData;
    await atp.resumeSession(session);
    theme = getTheme();
  }
  const resp = await bsky.actor.getProfile({
    actor: atp.session!.handle,
  });
  return { myProfile: resp.data, theme };
}) satisfies LoaderFunction;

export const element = <RootLayout />;

const composeButtonHideRoutes = [
  "/settings",
  "/about",
  "/notifications",
  /^\/[^/]*\/(followers|following)/,
];

function RootLayout() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const { myProfile, theme: loadedTheme } = useLoaderData() as {
    myProfile: AppBskyActorProfile.View;
    theme: Theme;
  };
  const { setTheme, theme, resolvedTheme } = useTheme(loadedTheme);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] =
    React.useState<AppBskyFeedFeedViewPost.Main>();
  const location = useLocation();

  const appContext: RootContext = {
    myProfile,
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
        <Header myProfile={myProfile} />
        <main>
          <PostComposer
            myProfile={appContext.myProfile}
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
  myProfile: AppBskyActorProfile.View;
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
