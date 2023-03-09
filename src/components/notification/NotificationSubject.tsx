import { AppBskyFeedPost, AppBskyNotificationList } from "@atproto/api";

import Prose from "@/src/components/Prose";
import Post from "@/src/components/post/Post";
import { usePostSingleQuery } from "@/src/lib/queries/usePostSingleQuery";

import styles from "./NotificationSubject.module.scss";

type Reason = AppBskyNotificationList.Notification["reason"];

type Props = {
  uri: string;
  reason: Reason;
  isSubject: boolean;
};

export default function NotificationPost({ uri, reason, isSubject }: Props) {
  const { data } = usePostSingleQuery({ uri: uri });
  if (!data) return null;
  switch (reason) {
    case "mention":
      return isSubject ? <SimplePost post={data.post} /> : <Post data={data} />;
    case "reply":
      return isSubject ? null : <Post data={data} />;
    case "repost":
      return <SimplePost post={data.post} />;
    case "vote":
      return <SimplePost post={data.post} />;
  }
  return <Post data={data} />;
}

function SimplePost({ post }: { post: AppBskyFeedPost.View }) {
  if (!AppBskyFeedPost.isRecord(post.record)) return null;

  return (
    <article className={styles.simplePost}>
      <Prose>{post.record.text}</Prose>
    </article>
  );
}
