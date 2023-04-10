import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import Notification from "@/src/app/notification/components/Notification";
import PostComposer from "@/src/app/post/components/PostComposer";
import { RevalidateOnPost } from "@/src/app/post/lib/types";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import SpinnerFill from "@/src/components/SpinnerFill";
import { bsky } from "@/src/lib/atp";

import styles from "./NotificationList.module.scss";

// TODO: support infinite scroll
export default function NotificationList() {
  const mounted = React.useRef(false);
  const queryClient = useQueryClient();
  const { data, status, error } = useInfiniteQuery({
    queryKey: queryKeys.notifications.$,
    async queryFn({ pageParam }) {
      const resp = await bsky.notification.listNotifications({
        limit: 20,
        // passing `undefined` breaks the query somehow
        ...(pageParam ? { cursor: pageParam.cursor } : {}),
      });
      return resp.data;
    },
    getNextPageParam(lastPage) {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
  });
  const allItems = (data?.pages.flatMap((p) => p.notifications) ?? []).filter(
    (n) => !n.author.viewer?.muted
  );
  const revalidateOnPost: RevalidateOnPost = ({ replyTarget }) => {
    if (replyTarget) {
      queryClient.refetchQueries(
        queryKeys.posts.single.$({ uri: replyTarget.post.uri })
      );
    }
  };

  React.useEffect(() => {
    if (!mounted.current) {
      bsky.notification.updateSeen({
        seenAt: new Date().toISOString(),
      });
      queryClient.setQueryData(queryKeys.notifications.count.$, () => 0);
    }
    mounted.current = true;
  }, [queryClient]);

  if (status === "loading") {
    return <SpinnerFill />;
  } else if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <>
      <ul>
        {allItems.map((item) => (
          <li
            key={`${item.uri}:${item.reason}:${item.isRead}`}
            className={styles.item}
          >
            <Notification notification={item} />
          </li>
        ))}
      </ul>
      {/* used when reply */}
      <PostComposer revalidate={revalidateOnPost} showButton={false} />
    </>
  );
}
