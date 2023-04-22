import { AppBskyFeedDefs } from "@atproto/api";
import clsx from "clsx";
import React from "react";

import Post from "@/src/app/post/components/Post";
import { MutatePostCache } from "@/src/app/post/lib/types";

import styles from "./Thread.module.scss";

type Props = {
  thread:
    | AppBskyFeedDefs.ThreadViewPost
    | AppBskyFeedDefs.NotFoundPost
    | { [k: string]: unknown; $type: string };
  isSelected?: boolean;
  revalidate: () => void;
  mutatePostCache?: MutatePostCache;
};

export default function Thread({
  thread,
  isSelected,
  revalidate,
  mutatePostCache,
}: Props) {
  React.useLayoutEffect(() => {
    if (!isSelected || !AppBskyFeedDefs.isThreadViewPost(thread)) return;
    document.getElementById(thread.post.uri)?.scrollIntoView();
  }, [isSelected, thread]);

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
        isEmbedLink={true}
        revalidate={revalidate}
        mutatePostCache={mutatePostCache}
        className={clsx(styles.post, { [styles.selected]: isSelected })}
        id={thread.post.uri}
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
