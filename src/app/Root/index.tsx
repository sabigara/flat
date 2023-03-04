import { atp } from "@/src/lib/atp";
import type { AtpSessionData } from "@atproto/api";
import { LoaderFunction, Outlet, redirect } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { HomeTimeline } from "@/src/app/Root/HomeTimeline";

import styles from "./index.module.scss";
import Header from "@/src/app/Root/Header";

export const loader = (async () => {
  if (!atp.hasSession) {
    const sessionStr = localStorage.getItem("session");
    if (!sessionStr) return redirect("/login");
    const session = JSON.parse(sessionStr) as AtpSessionData;
    try {
      await atp.resumeSession(session);
    } catch (e) {
      console.log(e);
    }
  }
  return null;
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
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.container}>
        <Header />
        <main>
          <HomeTimeline />
        </main>
      </div>
    </QueryClientProvider>
  );
}
