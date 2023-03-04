import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import * as Root from "@/src/app/Root";
import * as Home from "@/src/app/Root/HomeTimeline";
import * as Login from "@/src/app/Login";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    ...Root,
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
