import { AppBskyEmbedRecord, AppBskyFeedPost } from "@atproto/api";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

import Avatar from "@/src/components/Avatar";
import { buildPostUrl } from "@/src/lib/post";

import styles from "./EmbeddedRecord.module.scss";

type Props = {
  record: AppBskyEmbedRecord.PresentedRecord;
  className?: string;
};

export default function EmbeddedRecord({ record, className }: Props) {
  const navigate = useNavigate();
  const author = record.author;
  const post = record.record;
  if (!AppBskyFeedPost.isRecord(post)) {
    return null;
  }
  const postUrl = buildPostUrl({
    handle: author.handle,
    uri: record.uri,
  });

  const handleClickBackground: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    navigate(postUrl);
  };

  return (
    <article
      onClick={handleClickBackground}
      className={clsx(styles.container, className)}
    >
      {/* TODO: better link text */}
      <Link to={postUrl} className="visually-hidden">
        引用された投稿
      </Link>
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <Avatar profile={author} className={styles.avatar} />
        </div>
        {author.displayName && (
          <Link
            to={`/${author.handle}`}
            onClick={(e) => e.stopPropagation()}
            className={styles.displayName}
          >
            {author.displayName}
          </Link>
        )}
        <span className={styles.handle}>@{author.handle}</span>
      </div>
      <p className={styles.body}>{post.text}</p>
    </article>
  );
}
