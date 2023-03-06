import { formatDistanceShort } from "@/src/lib/time";
import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { Tag } from "@camome/core/Tag";
import { Link } from "react-router-dom";
import Prose from "@/src/components/Prose";
import Avatar from "@/src/components/Avatar";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedFeedViewPost.Main;
};

export default function Post({ data }: Props) {
  const { post, reason, reply } = data;
  // const { mutate } = useMutation(async () => {
  //   await bsky.feed.setVote({
  //     direction: "up",
  //     subject: {
  //       cid: post.cid,
  //       uri: post.uri,
  //     },
  //   });
  // });

  // TODO: `encodeURIComponent()` causes 404 error
  const uriBase64 = btoa(post.uri);
  const threadHref = `/posts/${uriBase64}`;
  const profileHref = `/${post.author.handle.replace(".bsky.social", "")}`;

  const reactions: ReactionProps[] = [
    {
      type: "reply",
      count: post.replyCount,
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": `${post.replyCount}件の返信`,
      reacted: false,
    },
    {
      type: "repost",
      count: post.repostCount,
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": `${post.replyCount}件のリポスト`,
      reacted: false,
    },
    {
      type: "upvote",
      count: post.upvoteCount,
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": `${post.replyCount}件のいいね`,
      reacted: false,
    },
  ];

  return (
    <article className={styles.container}>
      {reason && AppBskyFeedFeedViewPost.isReasonRepost(reason) && (
        <Tag
          colorScheme="neutral"
          size="sm"
          startDecorator={<FaRetweet />}
          className={styles.repost}
        >
          Repost by {reason.by.displayName}
        </Tag>
      )}
      <div className={styles.main}>
        <div className={styles.left}>
          <Avatar
            isLink
            profile={post.author}
            size="sm"
            className={styles.avatar}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            <Link to={profileHref} className={styles.displayName}>
              {post.author.displayName}
            </Link>
            <span className={styles.name}>
              @{post.author.handle.replace(".bsky.social", "")}
            </span>
            <time dateTime={post.indexedAt} className={styles.time}>
              {formatDistanceShort(new Date(post.indexedAt))}
            </time>
          </div>
          {reply && (
            <Tag
              colorScheme="neutral"
              size="sm"
              startDecorator={<BsReplyFill />}
              className={styles.reply}
            >
              Reply to{" "}
              {reply.parent.author.displayName ??
                `@${reply.parent.author.handle}`}
            </Tag>
          )}
          <Prose className={styles.prose}>{(post.record as any).text}</Prose>
          {/* if (AppBskyEmbedImages.isPresented(post.embed)) ... */}
          <ul className={styles.reactionList}>
            {reactions.map((reaction) => (
              <Reaction {...reaction} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

type ReactionProps = {
  type: "reply" | "repost" | "upvote";
  icon: React.ReactNode;
  iconReacted: React.ReactNode;
  count: number;
  onClick?: () => void;
  ["aria-label"]: string;
  reacted: boolean;
};

function Reaction({
  type,
  icon,
  iconReacted,
  count,
  onClick,
  reacted,
  ...props
}: ReactionProps) {
  return (
    <button
      aria-label={props["aria-label"]}
      onClick={onClick}
      disabled={reacted}
      className={styles.reaction}
    >
      <input type="hidden" name="type" value={type} />
      <span className={styles.reaction__icon}>
        {reacted ? iconReacted : icon}
      </span>
      <span aria-hidden>{count}</span>
    </button>
  );
}
