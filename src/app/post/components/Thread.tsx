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
    | AppBskyFeedDefs.BlockedPost
    | { [k: string]: unknown; $type: string };
  lineUp?: boolean;
  isParent?: boolean;
  isSelected?: boolean;
  revalidate: () => void;
  mutatePostCache?: MutatePostCache;
};

export default function Thread({
  thread,
  lineUp,
  isParent,
  isSelected,
  revalidate,
  mutatePostCache,
}: Props) {
  React.useEffect(() => {
    if (!isSelected || !AppBskyFeedDefs.isThreadViewPost(thread)) return;
    const target = document.getElementById(thread.post.uri);
    if (!target) return;
    const headerOffset = 3.5 * 16; // FIXME: better way to get height of header
    const offsetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, [isSelected, thread]);

  // TODO: consider other cases
  if (!AppBskyFeedDefs.isThreadViewPost(thread)) return null;

  const lineDown = (!!thread.replies?.length && !isSelected) || isParent;

  return (
    <>
      {thread.parent && (
        <Thread
          thread={thread.parent}
          revalidate={revalidate}
          isParent
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
        line={{
          down: !!lineDown,
          up: !!lineUp || (!!thread.parent && !isSelected),
        }}
        className={clsx(styles.post, {
          [styles.selected]: isSelected,
          [styles.withLine]: lineDown,
        })}
        id={thread.post.uri}
      />
      {thread.replies?.sort(makeSort(thread.post.author.did))?.map((reply) => (
        <Thread
          thread={reply}
          revalidate={revalidate}
          mutatePostCache={mutatePostCache}
          lineUp={lineDown}
          key={thread.post.uri as string}
        />
      ))}
    </>
  );
}

type Reply =
  | AppBskyFeedDefs.ThreadViewPost
  | AppBskyFeedDefs.NotFoundPost
  | AppBskyFeedDefs.BlockedPost
  | {
      $type: string;
      [k: string]: unknown;
    };

// the reply by the author of the post should be shown.
// TODO: consider root author
function makeSort(parentAuthorDid: string) {
  return (a: Reply, b: Reply) => {
    if (
      !AppBskyFeedDefs.isThreadViewPost(a) ||
      !AppBskyFeedDefs.isThreadViewPost(b)
    )
      return 0;
    return a.post.author.did === parentAuthorDid ? -1 : 1;
  };
}
