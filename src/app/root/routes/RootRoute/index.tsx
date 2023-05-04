import { LoaderFunction, redirect } from "react-router-dom";

import { getAccount } from "@/src/app/account/lib/getAccount";
import { DefaultErrorBoundary } from "@/src/app/error/components/DefaultErrorBoundary";
import { queryClient } from "@/src/app/root/lib/queryClient";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { RootRoute } from "@/src/app/root/routes/RootRoute/RootRoute";
import { getTheme } from "@/src/app/theme/lib/getTheme";

export const loader = (async () => {
  const account = await getAccount();
  // Login required in every routes except for `/login`
  // so that return value of `useSessionQuery` is guaranteed to be non-null.
  // But it will be nullable once atp's public APIs are supported.
  if (!account) return redirect("/login");
  queryClient.setQueryData(queryKeys.session.$, account);
  return { theme: getTheme() };
}) satisfies LoaderFunction;

// separate the file for the content of `element` to
// avoid full-reload caused by tiny code changes like CSS.
export const element = <RootRoute />;
export const errorElement = <DefaultErrorBoundary />;
