import {
  AtpSessionData,
  AppBskyActorProfile,
  AppBskyFeedFeedViewPost,
} from "@atproto/api";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
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
import { feedItemToUniqueKey } from "@/src/lib/post";

import styles from "./Layout.module.scss";

export const loader = (async () => {
  if (!atp.hasSession) {
    const sessionStr = localStorage.getItem("session");
    if (!sessionStr) return redirect("/login");
    const session = JSON.parse(sessionStr) as AtpSessionData;
    await atp.resumeSession(session);
  }
  const resp = await bsky.actor.getProfile({
    actor: atp.session!.handle,
  });
  return resp.data;
}) satisfies LoaderFunction;

export const element = <RootLayout />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const composeButtonHideRoutes = ["/about", "/notifications"];

function RootLayout() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const myProfile = useLoaderData() as AppBskyActorProfile.View;
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] =
    React.useState<AppBskyFeedFeedViewPost.Main>();
  const location = useLocation();

  const appContext: RootContext = {
    myProfile: myProfile,
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

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollRestoration />
      <div className={styles.container}>
        <Header profile={myProfile} />
        <main>
          <PostComposer
            myProfile={appContext.myProfile}
            open={appContext.composer.open}
            setOpen={appContext.composer.setOpen}
            onClickCompose={appContext.composer.handleClickCompose}
            replyTarget={appContext.composer.replyTarget}
            showButton={!composeButtonHideRoutes.includes(location.pathname)}
            // keep it's internal state until replyTarget changes or removed.
            key={
              appContext.composer.replyTarget &&
              feedItemToUniqueKey(appContext.composer.replyTarget)
            }
          />
          <Outlet context={appContext} />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export type RootContext = {
  myProfile: AppBskyActorProfile.View;
  composer: {
    open: boolean;
    setOpen: (val: boolean) => void;
    replyTarget?: AppBskyFeedFeedViewPost.Main;
    setReplyTarget: (feedItem: RootContext["composer"]["replyTarget"]) => void;
    handleClickCompose: () => void;
    handleClickReply: RootContext["composer"]["setReplyTarget"];
  };
};
