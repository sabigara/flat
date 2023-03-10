import { AppBskyFeedGetPostThread } from "@atproto/api";
import { useLoaderData, useOutletContext } from "react-router-dom";

import type { PostRouteLoaderResult } from "@/src/app/Root/Post";

import { RootContext } from "@/src/app/Root/Layout";
import Thread from "@/src/components/post/Thread";

import styles from "./PostRoute.module.scss";

export default function PostRoute() {
  const {
    composer: { handleClickReply },
  } = useOutletContext<RootContext>();
  const thread = useLoaderData() as PostRouteLoaderResult;
  // TODO: correct?
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  // key shouldn't be required but posts are duplicated only when transitioned by the router.
  return (
    <div className={styles.container}>
      <Thread
        thread={thread}
        onClickReply={handleClickReply}
        isRoot
        key={thread.post.uri}
      />
    </div>
  );
}
