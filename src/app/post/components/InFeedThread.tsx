import { AppBskyFeedDefs } from "@atproto/api";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Post from "@/src/app/post/components/Post";
import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import { MutatePostCache } from "@/src/app/post/lib/types";

import styles from "./InFeedThread.module.scss";

type Props = {
  postViews: AppBskyFeedDefs.FeedViewPost[];
  revalidate: () => void;
  mutatePostCache?: MutatePostCache;
  className?: (idx: number) => string;
};

export default function InFeedThread({
  postViews,
  revalidate,
  mutatePostCache,
  className,
}: Props) {
  const renderPost = (i: number, showViewFullThread = true) => {
    const view = postViews[i];
    if (!view) return null;
    return (
      <>
        {/* Often actual parent post is missing in the feed.
            We can render `view.reply.parent` but just ignore for brevity. */}
        {showViewFullThread &&
          i > 0 &&
          view.reply &&
          postViews.at(i - 1)?.post.uri !== view.reply.parent.uri && (
            <ViewFullThread post={view.reply.parent} />
          )}
        <Post
          data={view}
          isEmbedLink={true}
          revalidate={revalidate}
          mutatePostCache={mutatePostCache}
          line={{
            down: i < postViews.length - 1,
            up: i > 0,
          }}
          className={className?.(i)}
          key={view.post.cid}
        />
      </>
    );
  };
  return (
    <>
      {renderPost(0)}
      {renderPost(1)}
      {postViews.length <= 3 ? (
        renderPost(2)
      ) : (
        <>
          <ViewFullThread post={postViews.at(-2)!.post} />
          {renderPost(postViews.length - 1, false)}
        </>
      )}
    </>
  );
}

function ViewFullThread({ post }: { post: AppBskyFeedDefs.PostView }) {
  const { t } = useTranslation();
  return (
    <Link
      to={buildPostUrl({
        handle: post.author.handle,
        uri: post.uri,
      })}
      className={styles.viewThread}
    >
      <div className={styles.line}>
        <div className={styles.lineDot} />
        <div className={styles.lineDot} />
        <div className={styles.lineDot} />
      </div>
      {t("post.view-thread")}
    </Link>
  );
}
