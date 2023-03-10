import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import Notification from "@/src/components/notification/Notification";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

import styles from "./NotificationList.module.scss";

type Props = {
  onClickReply?: (feedItem: AppBskyFeedFeedViewPost.Main) => void;
};

// TODO: calling updateSeen every mount is too frequent.
export default function NotificationList({ onClickReply }: Props) {
  const queryClient = useQueryClient();
  const mounted = React.useRef(false);
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

  React.useEffect(() => {
    if (!mounted.current) {
      bsky.notification.updateSeen({
        seenAt: new Date().toISOString(),
      });
      queryClient.setQueryData(queryKeys.notifications.count.$, () => 0);
    }
    mounted.current = true;
  }, []);

  return (
    <ul>
      {allItems.map((item) => (
        <li
          key={`${item.uri}:${item.reason}:${item.isRead}`}
          className={styles.item}
        >
          <Notification notification={item} onClickReply={onClickReply} />
        </li>
      ))}
    </ul>
  );
}
