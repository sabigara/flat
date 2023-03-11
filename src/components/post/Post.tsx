import { AppBskyFeedFeedViewPost } from "@atproto/api";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

import Avatar from "@/src/components/Avatar";
import Prose from "@/src/components/Prose";
import Embed from "@/src/components/post/embed/Embed";
import { atp, bsky } from "@/src/lib/atp/atp";
import { buildPostUrl } from "@/src/lib/atp/post";
import { formatDistanceShort } from "@/src/lib/time";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedFeedViewPost.Main;
  onClickReply?: (feedItem: AppBskyFeedFeedViewPost.Main) => void;
  contentOnly?: boolean;
  isLink?: boolean;
  className?: string;
};

export default function Post({
  data,
  onClickReply,
  contentOnly = false,
  isLink = true,
  className,
}: Props) {
  const { post, reason, reply } = data;
  const [upvoted, setUpvoted] = React.useState(false);
  const [reposted, setReposted] = React.useState(false);
  const [repostUri, setRepostUri] = React.useState<string>();
  const navigate = useNavigate();

  const { mutate: mutateRepost } = useMutation({
    mutationFn: async ({
      reacted,
      repostUri,
    }: {
      reacted: boolean;
      repostUri: string | undefined;
    }) => {
      if (reacted && repostUri) {
        await bsky.feed.repost.delete({
          did: atp.session!.did,
          rkey: repostUri.split("/").pop(),
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
        setRepostUri(resp.uri);
      }
    },
    onMutate() {
      setReposted((curr) => !curr);
    },
  });

  const { mutate: mutateVote } = useMutation({
    mutationFn: async ({ reacted }: { reacted: boolean }) => {
      await bsky.feed.setVote({
        direction: reacted ? "none" : "up",
        subject: {
          cid: post.cid,
          uri: post.uri,
        },
      });
    },
    onMutate() {
      setUpvoted((curr) => !curr);
    },
  });

  // TODO: consider about encoding
  const profileHref = (handle: string) => `/${handle}`;

  const reactions = [
    {
      type: "reply",
      count: post.replyCount,
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": `${post.replyCount}件の返信`,
      onClick: () => onClickReply?.(data),
      reacted: false,
    },
    {
      type: "repost",
      count: post.repostCount + (reposted ? 1 : 0),
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "var(--color-repost)" }} />,
      "aria-label": `${post.replyCount}件のリポスト`,
      onClick: () => mutateRepost({ reacted: reposted, repostUri }),
      reacted: reposted,
    },
    {
      type: "upvote",
      count: post.upvoteCount + (upvoted ? 1 : 0),
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "var(--color-upvote)" }} />,
      "aria-label": `${post.replyCount}件のいいね`,
      onClick: () => mutateVote({ reacted: upvoted }),
      reacted: upvoted,
    },
  ] satisfies ReactionProps[];

  const postUrl = buildPostUrl({
    handle: post.author.handle,
    uri: post.uri,
  });

  const handleClickBackground: React.MouseEventHandler = () => {
    navigate(postUrl);
  };

  return (
    <article
      className={clsx(styles.container, { [styles.link]: isLink }, className)}
      onClick={isLink ? handleClickBackground : undefined}
    >
      {/* TODO: show on focus? */}
      <Link to={postUrl} className="visually-hidden">
        投稿の詳細
      </Link>
      {!contentOnly &&
        reason &&
        AppBskyFeedFeedViewPost.isReasonRepost(reason) && (
          <Tag
            component={Link}
            to={profileHref(reason.by.handle)}
            colorScheme="neutral"
            size="sm"
            startDecorator={<FaRetweet />}
            onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
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
  reacted: boolean;
  ["aria-label"]: string;
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
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
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
