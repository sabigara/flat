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
  React.useEffect(() => {
    if (!isSelected || !AppBskyFeedDefs.isThreadViewPost(thread)) return;
    const target = document.getElementById(thread.post.uri);
    if (!target) return;
    const headerOffset = 3.5 * 16; // FIXME: get value of var(--header-height)
    const offsetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
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
        foldable={!isSelected}
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
