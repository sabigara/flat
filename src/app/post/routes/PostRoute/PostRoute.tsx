import { AppBskyFeedGetPostThread, AppBskyFeedPost } from "@atproto/api";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";

import type { PostRouteLoaderResult } from "@/src/app/post/routes/PostRoute";

import Thread from "@/src/app/post/components/Thread";
import Seo from "@/src/app/seo/Seo";
import { userToName } from "@/src/app/user/lib/userToName";

import styles from "./PostRoute.module.scss";

const TITLE_POST_LEN = 32;

export default function PostRoute() {
  const thread = useLoaderData() as PostRouteLoaderResult;
  const revalidator = useRevalidator();
  // TODO: correct?
  if (!AppBskyFeedGetPostThread.isThreadViewPost(thread)) {
    return (
      <div className={styles.notFound}>
        <p>存在しない投稿です</p>
        <Link to="/">ホームへもどる</Link>
      </div>
    );
  }

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
        {/* key shouldn't be required but posts are duplicated only when transitioned by the router. */}
        <Thread
          thread={thread}
          isSelected
          revalidate={revalidator.revalidate}
          key={thread.post.uri}
        />
      </div>
    </>
  );
}
