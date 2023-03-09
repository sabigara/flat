import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

import Avatar from "@/src/components/Avatar";
import Prose from "@/src/components/Prose";
import Embed from "@/src/components/embed/Embed";
import { atp, bsky } from "@/src/lib/atp/atp";
import { formatDistanceShort } from "@/src/lib/time";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedFeedViewPost.Main;
  onClickReply?: (feedItem: AppBskyFeedFeedViewPost.Main) => void;
  contentOnly?: boolean;
  className?: string;
};

export default function Post({
  data,
  onClickReply,
  contentOnly = false,
  className,
}: Props) {
  const { post, reason, reply } = data;
  const [upvoted, setUpvoted] = React.useState(false);
  const [reposted, setReposted] = React.useState(false);
  const [repostedUri, setRepostedUri] = React.useState<string>();

  const { mutate: mutateVote } = useMutation(
    async () => {
      await bsky.feed.setVote({
        direction: upvoted ? "none" : "up",
        subject: {
          cid: post.cid,
          uri: post.uri,
        },
      });
    },
    {
      onMutate() {
        setUpvoted((curr) => !curr);
      },
    }
  );
  const { mutate: mutateRepost } = useMutation(
    async () => {
      if (reposted && repostedUri) {
        await bsky.feed.repost.delete({
          did: atp.session!.did,
          rkey: repostedUri.split("/").pop(),
        });
      } else {
        const resp = await bsky.feed.repost.create(
          {
            did: atp.session!.did,
          },
          {
            createdAt: new Date().toISOString(),
            subject: {
              cid: post.cid,
              uri: post.uri,
            },
          }
        );
        setRepostedUri(resp.uri);
      }
    },
    {
      onMutate() {
        setReposted((curr) => !curr);
      },
    }
  );

  // TODO: consider about encoding
  const profileHref = (handle: string) => `/${handle}`;

  const reactions: ReactionProps[] = [
    {
      type: "reply",
      count: post.replyCount,
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": `${post.replyCount}件の返信`,
      reacted: false,
      onClick: () => onClickReply?.(data),
    },
    {
      type: "repost",
      count: post.repostCount + (reposted ? 1 : 0),
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": `${post.replyCount}件のリポスト`,
      reacted: reposted,
      onClick: mutateRepost,
    },
    {
      type: "upvote",
      count: post.upvoteCount + (upvoted ? 1 : 0),
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": `${post.replyCount}件のいいね`,
      reacted: upvoted,
      onClick: mutateVote,
    },
  ];

  return (
    <article className={clsx(styles.container, className)}>
      {!contentOnly &&
        reason &&
        AppBskyFeedFeedViewPost.isReasonRepost(reason) && (
          <Tag
            component={Link}
            to={profileHref(reason.by.handle)}
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
            <Link
              to={profileHref(post.author.handle)}
              className={styles.displayName}
            >
              {post.author.displayName}
            </Link>
            <span className={styles.name}>
              @{post.author.handle.replace(".bsky.social", "")}
            </span>
            <time dateTime={post.indexedAt} className={styles.time}>
              {formatDistanceShort(new Date(post.indexedAt))}
            </time>
          </div>
          {!contentOnly && reply && (
            <Tag
              component={Link}
              to={profileHref(reply.parent.author.handle)}
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
          {post.embed && <Embed embed={post.embed} className={styles.embed} />}
          {!contentOnly && (
            <ul className={styles.reactionList}>
              {reactions.map((reaction) => (
                <Reaction {...reaction} key={reaction.type} />
              ))}
            </ul>
          )}
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
