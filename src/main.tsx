import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@camome/system/dist/theme.css";
import "@/src/styles/globals.scss";

import * as Login from "@/src/app/Login";
import * as Root from "@/src/app/Root";
import * as About from "@/src/app/Root/About";
import * as Followers from "@/src/app/Root/Followers";
import * as Following from "@/src/app/Root/Following";
import * as RootLayout from "@/src/app/Root/Layout";
import * as Notifications from "@/src/app/Root/Notifications";
import * as Post from "@/src/app/Root/Post";
import * as Profile from "@/src/app/Root/Profile";
import * as Settings from "@/src/app/Root/Settings";
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Seo {...defaultSeo} />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
