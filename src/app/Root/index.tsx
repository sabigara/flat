import { atp, bsky } from "@/src/lib/atp";
import type { AtpSessionData, AppBskyActorProfile } from "@atproto/api";
import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { HomeTimeline } from "@/src/app/Root/HomeTimeline";
import PostComposer from "@/src/app/Root/PostComposer";

import styles from "./index.module.scss";
import Header from "@/src/app/Root/Header";

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

export const element = <RootRoute />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

function RootRoute() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const profile = useLoaderData() as AppBskyActorProfile.View;
  const pathname = useLocation().pathname;
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.container}>
        <Header profile={profile} />
        <PostComposer profile={profile} />
        <main>{pathname === "/" ? <HomeTimeline /> : <Outlet />}</main>
      </div>
    </QueryClientProvider>
  );
}
