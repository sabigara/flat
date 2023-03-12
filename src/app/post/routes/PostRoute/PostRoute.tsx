import { AppBskyFeedGetPostThread, AppBskyFeedPost } from "@atproto/api";
import { useLoaderData } from "react-router-dom";

import type { PostRouteLoaderResult } from "@/src/app/post/routes/PostRoute";

import Thread from "@/src/app/post/components/Thread";
import Seo from "@/src/app/seo/Seo";
import { userToName } from "@/src/app/user/lib/userToName";

import styles from "./PostRoute.module.scss";

const TITLE_POST_LEN = 32;

export default function PostRoute() {
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
      <Seo title={`${userToName(thread.post.author)}「${titlePostText}」`} />
      <div className={styles.container}>
        <Thread thread={thread} isSelected key={thread.post.uri} />
      </div>
    </>
  );
}
