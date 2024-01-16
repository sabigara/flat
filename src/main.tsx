import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@camome/system/dist/theme.css";
import "@/src/styles/globals.scss";

import * as Accounts from "@/src/app/account/routes/AccountsRoute";
import * as HomeTimelineRoute from "@/src/app/account/routes/HomeFeedRoute";
import * as Login from "@/src/app/account/routes/LoginRoute";
import * as Settings from "@/src/app/account/routes/SettingsRoute";
import * as Notifications from "@/src/app/notification/routes/NotificationsRoute";
import * as Post from "@/src/app/post/routes/PostRoute";
import { queryClient } from "@/src/app/root/lib/queryClient";
import * as RootRoute from "@/src/app/root/routes/RootRoute";
import * as SearchUsers from "@/src/app/search/routes/SearchUsersRoute";
import Seo from "@/src/app/seo/Seo";
import { defaultSeo } from "@/src/app/seo/defaultSeo";
import * as Followers from "@/src/app/user/routes/FollowersRoute";
import * as Following from "@/src/app/user/routes/FollowingRoute";
import * as ProfileFeedLikes from "@/src/app/user/routes/ProfileFeedLikesRoute";
import * as ProfileFeedMedia from "@/src/app/user/routes/ProfileFeedMediaRoute";
import * as ProfileFeedPosts from "@/src/app/user/routes/ProfileFeedPostsRoute";
import * as ProfileFeedPostsWithReplies from "@/src/app/user/routes/ProfileFeedPostsWithRepliesRoute";
import * as Profile from "@/src/app/user/routes/ProfileRoute";
import { migrateLocalStorage } from "@/src/lib/storage";

import "@/src/i18n/config";

migrateLocalStorage();

const router = createBrowserRouter([
  {
    path: "/",
    ...RootRoute,
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
        path: "/accounts",
        ...Accounts,
      },
      {
        path: "/notifications",
        ...Notifications,
      },
      {
        path: "/search",
        ...SearchUsers,
      },
      {
        path: "/:handle",
        ...Profile,
        children: [
          {
            path: "/:handle",
            ...ProfileFeedPosts,
          },
          {
            path: "/:handle/with-replies",
            ...ProfileFeedPostsWithReplies,
          },
          {
            path: "/:handle/likes",
            ...ProfileFeedLikes,
          },
          {
            path: "/:handle/media",
            ...ProfileFeedMedia,
          },
        ],
      },
      {
        path: "/:handle/followers",
        ...Followers,
      },
      {
        path: "/:handle/following",
        ...Following,
      },
      {
        path: "/:handle/posts/:rkey",
        ...Post,
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
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <HelmetProvider>
        <TooltipProvider>
          <Seo {...defaultSeo} />
          <Toaster
            toastOptions={{
              className: "toast",
            }}
          />
          <RouterProvider router={router} />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
