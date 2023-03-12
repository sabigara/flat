import { AppBskyFeedGetPostThread, AppBskyFeedPost } from "@atproto/api";
import { useLoaderData, useOutletContext } from "react-router-dom";

import type { PostRouteLoaderResult } from "@/src/app/post/PostRoute";

import { RootContext } from "@/src/app/RootRoute/RootRoute";
import Thread from "@/src/components/post/Thread";
import { toUsername } from "@/src/lib/atp/user";
import Seo from "@/src/seo/Seo";

import styles from "./PostRoute.module.scss";

const TITLE_POST_LEN = 32;

export default function PostRoute() {
  const {
    composer: { handleClickReply },
  } = useOutletContext<RootContext>();
  const thread = useLoaderData() as PostRouteLoaderResult;
  // TODO: correct?
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) return null;
  // key shouldn't be required but posts are duplicated only when transitioned by the router.

  const postText = AppBskyFeedPost.isRecord(thread.post.record)
    ? thread.post.record.text
    : "";
  const titlePostText =
    postText.slice(0, TITLE_POST_LEN) +
    (postText.length > TITLE_POST_LEN ? "..." : "");

  return (
    <>
      <Seo title={`${toUsername(thread.post.author)}「${titlePostText}」`} />
      <div className={styles.container}>
        <Thread
          thread={thread}
          onClickReply={handleClickReply}
          isSelected
          key={thread.post.uri}
        />
      </div>
    </>
  );
}
