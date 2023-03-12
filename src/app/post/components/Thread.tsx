import { AppBskyFeedGetPostThread } from "@atproto/api";
import clsx from "clsx";

import Post from "@/src/app/post/components/Post";

import styles from "./Thread.module.scss";

type Props = {
  thread:
    | AppBskyFeedGetPostThread.ThreadViewPost
    | AppBskyFeedGetPostThread.NotFoundPost
    | { [k: string]: unknown; $type: string };
  isSelected?: boolean;
  revalidate: () => void;
};

export default function Thread({ thread, isSelected, revalidate }: Props) {
  // TODO: consider other cases
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;

  return (
    <>
      {thread.parent && (
        <Thread thread={thread.parent} revalidate={revalidate} />
      )}
      <Post
        data={thread}
        isLink={!isSelected}
        revalidate={revalidate}
        className={clsx(styles.post, { [styles.selected]: isSelected })}
      />
      {thread.replies?.map((reply) => (
        <Thread
          thread={reply}
          revalidate={revalidate}
          key={thread.post.uri as string}
        />
      ))}
    </>
  );
}
