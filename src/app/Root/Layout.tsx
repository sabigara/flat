import React from "react";
import { atp, bsky } from "@/src/lib/atp/atp";
import {
  AtpSessionData,
  AppBskyActorProfile,
  AppBskyFeedFeedViewPost,
} from "@atproto/api";
import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  ScrollRestoration,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Header from "@/src/components/Header";

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

function RootLayout() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const profile = useLoaderData() as AppBskyActorProfile.View;
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] =
    React.useState<AppBskyFeedFeedViewPost.Main>();

  const appContext: RootContext = {
    profile,
    composer: {
      open: composerOpen,
      setOpen: setComposerOpen,
      replyTarget,
      setReplyTarget,
      handleOpen: (val) => {
        setReplyTarget(undefined);
        setComposerOpen(val);
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
        <Header profile={profile} />
        <main>
          <Outlet context={appContext} />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export type RootContext = {
  profile: AppBskyActorProfile.View;
  composer: {
    open: boolean;
    setOpen: (val: boolean) => void;
    replyTarget?: AppBskyFeedFeedViewPost.Main;
    setReplyTarget: (feedItem: RootContext["composer"]["replyTarget"]) => void;
    handleOpen: RootContext["composer"]["setOpen"];
    handleClickReply: RootContext["composer"]["setReplyTarget"];
  };
};
