import { AppBskyFeedDefs } from "@atproto/api";
import clsx from "clsx";
import { Draft } from "immer";

import Post from "@/src/app/post/components/Post";

import styles from "./Thread.module.scss";

type Props = {
  thread:
    | AppBskyFeedDefs.ThreadViewPost
    | AppBskyFeedDefs.NotFoundPost
    | { [k: string]: unknown; $type: string };
  isSelected?: boolean;
  revalidate: () => void;
  mutatePostCache?: (params: {
    cid: string;
    fn: (draft: Draft<AppBskyFeedDefs.PostView>) => void;
  }) => void;
};

export default function Thread({
  thread,
  isSelected,
  revalidate,
  mutatePostCache,
}: Props) {
  // TODO: consider other cases
  if (!AppBskyFeedDefs.isThreadViewPost(thread)) return null;

  return (
    <>
      {thread.parent && (
        <Thread
          thread={thread.parent}
          revalidate={revalidate}
          mutatePostCache={mutatePostCache}
        />
      )}
      <Post
        data={thread}
        isLink={!isSelected}
        revalidate={revalidate}
        mutatePostCache={mutatePostCache}
        className={clsx(styles.post, { [styles.selected]: isSelected })}
      />
      {thread.replies?.map((reply) => (
        <Thread
          thread={reply}
          revalidate={revalidate}
          mutatePostCache={mutatePostCache}
          key={thread.post.uri as string}
        />
      ))}
    </>
  );
}
