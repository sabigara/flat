import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  AppBskyNotificationListNotifications,
} from "@atproto/api";
import { useQueryClient } from "@tanstack/react-query";
import produce from "immer";
import { Link } from "react-router-dom";

import Post from "@/src/app/post/components/Post";
import { usePostThreadQuery } from "@/src/app/post/hooks/usePostThreadQuery";
import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import { MutatePostCache } from "@/src/app/post/lib/types";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Prose from "@/src/components/Prose";

import styles from "./NotificationPost.module.scss";

type Reason = AppBskyNotificationListNotifications.Notification["reason"];

type Props = {
  uri: string;
  reason: Reason;
  isSubject: boolean;
};

export default function NotificationPost({ uri, reason, isSubject }: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = usePostThreadQuery({ uri: uri });
  if (isLoading) return <p className={styles.loading}>投稿を取得中...</p>;
  if (!data)
    return <article className={styles.simplePost}>削除済みの投稿</article>;

  const mutatePostCache: MutatePostCache = ({ fn }) => {
    queryClient.setQueryData<AppBskyFeedDefs.FeedViewPost>(
      queryKeys.posts.single.$({ uri }),
      (data) => {
        if (!data) throw new Error("Shouldn't reach here");
        return produce(data, (draft) => fn(draft.post));
      }
    );
  };

  const postElem = (
    <Post data={data} mutatePostCache={mutatePostCache} revalidate={refetch} />
  );
  const simplePostElm = <SimplePost post={data.post} />;

  switch (reason) {
    case "mention":
      return isSubject ? simplePostElm : postElem;
    case "reply":
      return isSubject ? (
        <div className={styles.replySubject}>{simplePostElm}</div>
      ) : (
        postElem
      );
    case "repost":
    case "like":
      // always subject
      return simplePostElm;
    default:
      return postElem;
  }
}

function SimplePost({ post }: { post: AppBskyFeedDefs.PostView }) {
  if (!AppBskyFeedPost.isRecord(post.record)) return null;

  return (
    <article className={styles.simplePost}>
      <Link
        to={buildPostUrl({
          handle: post.author.handle,
          uri: post.uri,
        })}
      >
        <Prose>{post.record.text}</Prose>
      </Link>
    </article>
  );
}
