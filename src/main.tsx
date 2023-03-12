import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@camome/system/dist/theme.css";
import "@/src/styles/globals.scss";

import * as About from "@/src/app/about/routes/AboutRoute";
import * as HomeTimelineRoute from "@/src/app/account/routes/HomeTimelineRoute";
import * as Login from "@/src/app/account/routes/LoginRoute";
import * as Settings from "@/src/app/account/routes/SettingsRoute";
import { notifyError } from "@/src/app/error/lib/notifyError";
import * as Notifications from "@/src/app/notification/routes/NotificationsRoute";
import * as Post from "@/src/app/post/routes/PostRoute";
import * as RootLayout from "@/src/app/root/routes/RootRoute/RootRoute";
import Seo from "@/src/app/seo/Seo";
import { defaultSeo } from "@/src/app/seo/defaultSeo";
import * as Followers from "@/src/app/user/routes/FollowersRoute";
import * as Following from "@/src/app/user/routes/FollowingRoute";
import * as Profile from "@/src/app/user/routes/ProfileRoute";

const router = createBrowserRouter([
  {
    path: "/",
    ...RootLayout,
    children: [
      {
        index: true,
        ...HomeTimelineRoute,
      },
      {
        path: "/settings",
        ...Settings,
      },
      {
        path: "/about",
        ...About,
      },
      {
        path: "/notifications",
        ...Notifications,
      },
      {
        path: "/:handle",
        ...Profile,
      },
      {
        path: "/:handle/posts/:rkey",
        ...Post,
      },
      {
        path: "/:handle/followers",
        ...Followers,
      },
      {
        path: "/:handle/following",
        ...Following,
      },
    ],
  },
  {
    path: "/login",
    ...Login,
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      onError(error) {
        notifyError({ error, message: "エラーが発生しました" });
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Seo {...defaultSeo} />
        <Toaster />
        <RouterProvider router={router} />
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
