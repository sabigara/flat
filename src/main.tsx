import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@camome/system/dist/theme.css";
import "@/src/styles/globals.scss";

import * as Root from "@/src/app/RootRoute";
import * as RootLayout from "@/src/app/RootRoute/RooteRouteLayout";
import * as About from "@/src/app/about/AboutRoute";
import * as Login from "@/src/app/account/LoginRoute";
import * as Settings from "@/src/app/account/SettingsRoute";
import * as Notifications from "@/src/app/notification/NotificationsRoute";
import * as Post from "@/src/app/post/PostRoute";
import * as Followers from "@/src/app/user/FollowersRoute";
import * as Following from "@/src/app/user/FollowingRoute";
import * as Profile from "@/src/app/user/ProfileRoute";
import { handleError } from "@/src/lib/error";
import Seo from "@/src/seo/Seo";
import { defaultSeo } from "@/src/seo/defaultSeo";

const router = createBrowserRouter([
  {
    path: "/",
    ...RootLayout,
    children: [
      {
        index: true,
        ...Root,
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
        handleError({ error, message: "エラーが発生しました" });
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
