import {
  AppBskyFeedFeedViewPost,
  AppBskyFeedGetPostThread,
} from "@atproto/api";
import clsx from "clsx";

import Post from "@/src/app/post/components/Post";

import styles from "./Thread.module.scss";

type Props = {
  thread:
    | AppBskyFeedGetPostThread.ThreadViewPost
    | AppBskyFeedGetPostThread.NotFoundPost
    | { [k: string]: unknown; $type: string };
  isSelected?: boolean;
  onClickReply?: (feedItem: AppBskyFeedFeedViewPost.Main) => void;
};

export default function Thread({ thread, isSelected, onClickReply }: Props) {
  // TODO: consider other cases
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  return (
    <>
      {thread.parent && (
        <Thread thread={thread.parent} onClickReply={onClickReply} />
      )}
      <Post
        data={thread}
        onClickReply={onClickReply}
        isLink={!isSelected}
        className={clsx(styles.post, { [styles.selected]: isSelected })}
      />
      {thread.replies?.map((reply) => (
        <Thread
          thread={reply}
          key={thread.post.uri as string}
          onClickReply={onClickReply}
        />
      ))}
    </>
  );
}
