import { LoaderFunction, redirect } from "react-router-dom";

import { getAccount } from "@/src/app/account/lib/getAccount";
import { queryClient } from "@/src/app/root/lib/queryClient";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { RootRoute } from "@/src/app/root/routes/RootRoute/RootRoute";
import { getTheme } from "@/src/app/theme/lib/getTheme";

export const loader = (async () => {
  const account = await getAccount();
  // login required in every routes except for `/login`
  if (!account) return redirect("/login");
  queryClient.setQueryData(queryKeys.session.$, account);
  return { theme: getTheme() };
}) satisfies LoaderFunction;

export const element = <RootRoute />;
