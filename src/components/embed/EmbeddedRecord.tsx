import Avatar from "@/src/components/Avatar";
import { AppBskyEmbedRecord, AppBskyFeedPost } from "@atproto/api";
import clsx from "clsx";

import styles from "./EmbeddedRecord.module.scss";

type Props = {
  record: AppBskyEmbedRecord.PresentedRecord;
  className?: string;
};

export default function EmbeddedRecord({ record, className }: Props) {
  const author = record.author;
  const post = record.record;
  if (!AppBskyFeedPost.isRecord(post)) {
    return null;
  }
  return (
    <article className={clsx(styles.container, className)}>
      {/* TODO: better link text */}
      {/* <Link to={`/posts/${record.uri}`} className="clickable-overlay">
        <span className="visually-hidden">引用された投稿</span>
      </Link> */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <Avatar profile={author} className={styles.avatar} />
        </div>
        {author.displayName && (
          <span className={styles.displayName}>{author.displayName}</span>
        )}
        <span className={styles.handle}>@{author.handle}</span>
      </div>
      <p className={styles.body}>{post.text}</p>
    </article>
  );
}
