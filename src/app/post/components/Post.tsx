import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Draft } from "immer";
import React from "react";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { TbDots, TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import PostMoreButton from "@/src/app/post/components/PostMoreButton";
import Embed from "@/src/app/post/components/embed/Embed";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import { formatDistanceShort } from "@/src/app/time/lib/time";
import Avatar from "@/src/app/user/components/Avatar";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";
import { bsky, atp, isReasonRepost } from "@/src/lib/atp";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedDefs.FeedViewPost;
  contentOnly?: boolean;
  isLink?: boolean;
  revalidate?: () => void;
  mutatePostCache?: (params: {
    cid: string;
    fn: (draft: Draft<AppBskyFeedDefs.PostView>) => void;
  }) => void;
  className?: string;
};

export default function Post({
  data,
  contentOnly = false,
  isLink = true,
  revalidate,
  mutatePostCache,
  className,
}: Props) {
  const { data: account } = useAccountQuery();
  const { handleClickReply } = usePostComposer();
  const { post, reason, reply } = data;
  const [optimisticallyReposted, setOptimisticallyReposted] = React.useState<
    boolean | undefined
  >(undefined);
  const [optimisticallyLiked, setOptimisticallyLiked] = React.useState<
    boolean | undefined
  >(undefined);
  const navigate = useNavigate();

  const reposted =
    optimisticallyReposted === undefined
      ? !!post.viewer?.repost
      : optimisticallyReposted;
  const liked =
    optimisticallyLiked === undefined
      ? !!post.viewer?.like
      : optimisticallyLiked;

  const { mutate: mutateRepost, isLoading: isMutatingRepost } = useMutation(
    async () => {
      let repostUri: string | undefined = undefined;
      if (post.viewer?.repost) {
        const uri = new AtUri(post.viewer.repost);
        await bsky.feed.repost.delete({
          repo: uri.hostname,
          rkey: uri.rkey,
        });
      } else {
        const resp = await bsky.feed.repost.create(
          {
            repo: atp.session!.did,
          },
          {
            subject: {
              cid: post.cid,
              uri: post.uri,
            },
            createdAt: new Date().toISOString(),
          }
        );
        repostUri = resp.uri;
      }
      return { repostUri };
    },
    {
      onMutate() {
        setOptimisticallyReposted((curr) => !curr);
      },
      onSuccess({ repostUri }) {
        mutatePostCache?.({
          cid: post.cid,
          fn: (draft: Draft<AppBskyFeedDefs.PostView>) => {
            if (!draft.repostCount) {
              draft.repostCount = 0;
            }
            draft.repostCount += repostUri ? +1 : -1;
            if (!draft.viewer) {
              draft.viewer = {};
            }
            draft.viewer.repost = repostUri;
          },
        });
        revalidate?.();
      },
    }
  );

  const { mutate: mutateVote, isLoading: isMutatingLike } = useMutation(
    async ({ did, post }: { did: string; post: AppBskyFeedDefs.PostView }) => {
      let likeUri: string | undefined = undefined;
      if (post.viewer?.like) {
        const uri = new AtUri(post.viewer.like);
        await bsky.feed.like.delete({
          repo: uri.hostname,
          rkey: uri.rkey,
        });
      } else {
        const resp = await bsky.feed.like.create(
          {
            repo: did,
          },
          {
            subject: {
              cid: post.cid,
              uri: post.uri,
            },
            createdAt: new Date().toISOString(),
          }
        );
        likeUri = resp.uri;
      }
      // TODO: error handling
      return { likeUri };
    },
    {
      onMutate() {
        setOptimisticallyLiked((curr) => !curr);
      },
      onSuccess({ likeUri }) {
        mutatePostCache?.({
          cid: post.cid,
          fn: (draft: Draft<AppBskyFeedDefs.PostView>) => {
            if (!draft.likeCount) {
              draft.likeCount = 0;
            }
            draft.likeCount += likeUri ? +1 : -1;
            if (!draft.viewer) {
              draft.viewer = {};
            }
            draft.viewer.like = likeUri;
          },
        });
        setOptimisticallyLiked(undefined);
      },
    }
  );

  // TODO: consider about encoding
  const profileHref = (handle: string) => `/${handle}`;

  const reactions = [
    {
      type: "reply",
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": `${post.replyCount ?? 0}件の返信`,
      count: post.replyCount ?? 0,
      onClick: () => handleClickReply(data),
      reacted: false,
    },
    {
      type: "repost",
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": `${post.repostCount ?? 0}件のリポスト`,
      count: post.repostCount ?? 0,
      reacted: reposted,
      disabled: isMutatingRepost,
      onClick: mutateRepost,
    },
    {
      type: "like",
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": `${post.likeCount ?? 0}件のいいね`,
      count: post.likeCount ?? 0,
      reacted: liked,
      disabled: isMutatingLike,
      onClick: () => atp.session && mutateVote({ did: atp.session.did, post }),
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
      {!contentOnly && reason && isReasonRepost(reason) && (
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
          {AppBskyFeedPost.isRecord(post.record) && (
            <RichTextRenderer {...post.record} className={styles.prose} />
          )}
          {post.embed && <Embed embed={post.embed} className={styles.embed} />}
          {!contentOnly && (
            <ul className={styles.reactionList}>
              {reactions.map((reaction) => (
                <li key={reaction.type}>
                  <Reaction {...reaction} />
                </li>
              ))}
              <li>
                <PostMoreButton
                  myProfile={account?.profile}
                  button={
                    <button
                      className={styles.reaction}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input type="hidden" name="type" />
                      <span className={styles.reaction__icon}>
                        <TbDots />
                      </span>
                    </button>
                  }
                  post={post}
                  revalidate={revalidate}
                />
              </li>
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

type ReactionProps = {
  type: "reply" | "repost" | "like";
  icon: React.ReactNode;
  iconReacted: React.ReactNode;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
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
  disabled,
  ...props
}: ReactionProps) {
  return (
    <button
      aria-label={props["aria-label"]}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick?.();
      }}
      className={clsx(styles.reaction, disabled && styles.disabled)}
    >
      <input type="hidden" name="type" value={type} />
      <span className={styles.reaction__icon}>
        {reacted ? iconReacted : icon}
      </span>
      <span aria-hidden>{count}</span>
    </button>
  );
}
