import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useLocation } from "react-router-dom";

import { queryKeys } from "@/src/app/root/lib/queryKeys";

const NOTIF_PATH = "/notifications" as const;

export function useClearNotifQueryData() {
  const { pathname } = useLocation();
  const prevPathname = React.useRef(pathname);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // execute only once on page transition from notif page to another.
    if (prevPathname.current === NOTIF_PATH && pathname !== NOTIF_PATH) {
      // remove pages except for the first to reduce redundant queries issued on revisits;
      // only the newest notifications should be interesting for users.
      queryClient.setQueryData(queryKeys.notifications.$, (data: any) => ({
        pages: data?.pages.slice(0, 1),
        pageParams: data?.pageParams.slice(0, 1),
      }));
    }
    prevPathname.current = pathname;
  }, [pathname, queryClient]);
}
