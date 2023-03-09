import { AppBskyFeedGetPostThread } from "@atproto/api";
import clsx from "clsx";

import Post from "@/src/components/post/Post";

import styles from "./Thread.module.scss";

type Props = {
  thread:
    | AppBskyFeedGetPostThread.ThreadViewPost
    | AppBskyFeedGetPostThread.NotFoundPost
    | { [k: string]: unknown; $type: string };
  isRoot?: boolean;
};

export default function Thread({ thread, isRoot }: Props) {
  // TODO: consider other cases
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  return (
    <>
      {thread.parent && <Thread thread={thread.parent} />}
      <Post
        data={thread}
        className={clsx(styles.post, { [styles.root]: isRoot })}
      />
      {thread.replies?.map((reply) => (
        <Thread thread={reply} key={thread.post.uri as string} />
      ))}
    </>
  );
}
