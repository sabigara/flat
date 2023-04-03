import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  AppBskyNotificationListNotifications,
} from "@atproto/api";

import Post from "@/src/app/post/components/Post";
import { usePostSingleQuery } from "@/src/app/post/hooks/usePostSingleQuery";
import Prose from "@/src/components/Prose";

import styles from "./NotificationSubject.module.scss";

type Reason = AppBskyNotificationListNotifications.Notification["reason"];

type Props = {
  uri: string;
  reason: Reason;
  isSubject: boolean;
  revalidate: () => void;
};

export default function NotificationPost({
  uri,
  reason,
  isSubject,
  revalidate,
}: Props) {
  const { data } = usePostSingleQuery({ uri: uri });
  if (!data) return null;

  const postElem = <Post data={data} revalidate={revalidate} />;
  const simplePostElm = <SimplePost post={data.post} />;

  switch (reason) {
    case "mention":
      return isSubject ? simplePostElm : postElem;
    case "reply":
      return isSubject ? null : postElem;
    case "repost":
    case "like":
      // always subject
      return simplePostElm;
  }
  return postElem;
}

function SimplePost({ post }: { post: AppBskyFeedDefs.PostView }) {
  if (!AppBskyFeedPost.isRecord(post.record)) return null;

  return (
    <article className={styles.simplePost}>
      <Prose>{post.record.text}</Prose>
    </article>
  );
}
