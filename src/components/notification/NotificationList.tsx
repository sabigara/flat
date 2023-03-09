import { useInfiniteQuery } from "@tanstack/react-query";

import Notification from "@/src/components/notification/Notification";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries";

import styles from "./NotificationList.module.scss";

export default function NotificationList() {
  const { data } = useInfiniteQuery({
    queryKey: queryKeys.notifications.$,
    async queryFn({ pageParam }) {
      const resp = await bsky.notification.list({
        limit: 20,
        // passing `undefined` breaks the query somehow
        ...(pageParam ? { before: pageParam.cursor } : {}),
      });
      return resp.data;
    },
    getNextPageParam(lastPage) {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
  });
  const allItems = data?.pages.flatMap((p) => p.notifications) ?? [];
  return (
    <ul>
      {allItems.map((item) => (
        <li key={`${item.uri}:${item.reason}:${item.isRead}`}>
          <Notification notification={item} />
        </li>
      ))}
    </ul>
  );
}
