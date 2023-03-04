import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@camome/system/dist/theme.css";
import "@/src/styles/globals.scss";

import * as Login from "@/src/app/Login";
import * as Root from "@/src/app/Root";
import * as Profile from "@/src/app/Root/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    ...Root,
    children: [
      {
        // <userId>.bsky.social
        path: "/:userId",
        ...Profile,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
