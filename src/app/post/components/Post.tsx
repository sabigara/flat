import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Draft } from "immer";
import React from "react";
import { useTranslation } from "react-i18next";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { TbDots, TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import PostMoreMenu from "@/src/app/post/components/PostMoreMenu";
import Embed from "@/src/app/post/components/embed/Embed";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import { MutatePostCache } from "@/src/app/post/lib/types";
import { formatDistanceShort } from "@/src/app/time/lib/time";
import Avatar from "@/src/app/user/components/Avatar";
import { userToName } from "@/src/app/user/lib/userToName";
import { Foldable } from "@/src/components/Foldable";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";
import { bsky, atp } from "@/src/lib/atp";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedDefs.FeedViewPost;
  contentOnly?: boolean;
  isLink?: boolean;
  isEmbedLink?: boolean;
  revalidate?: () => void;
  mutatePostCache?: MutatePostCache;
  foldable?: boolean;
  id?: string;
  className?: string;
};

export default function Post({
  data,
  contentOnly = false,
  isLink = true,
  isEmbedLink = true,
  revalidate,
  mutatePostCache,
  foldable = true,
  id,
  className,
}: Props) {
  const { t } = useTranslation();
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
    async ({ did, post }: { did: string; post: AppBskyFeedDefs.PostView }) => {
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
        repostUri = resp.uri;
      }
      return { repostUri };
    },
    {
      onMutate({ post }) {
        setOptimisticallyReposted(!post.viewer?.repost);
      },
      onSuccess({ repostUri }, { post }) {
        mutatePostCache?.({
          uri: post.uri,
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
        setOptimisticallyReposted(undefined);
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
      onMutate({ post }) {
        setOptimisticallyLiked(!post.viewer?.like);
      },
      onSuccess({ likeUri }, { post }) {
        mutatePostCache?.({
          uri: post.uri,
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
      "aria-label": t("post.reply.btn-label", {
        count: post.replyCount ?? 0,
      }),
      count: post.replyCount ?? 0,
      onClick: () => handleClickReply(data),
      reacted: false,
    },
    {
      type: "repost",
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": t("post.repost.btn-label", {
        count: post.repostCount ?? 0,
      }),
      count: post.repostCount ?? 0,
      reacted: reposted,
      disabled: isMutatingRepost,
      onClick: () =>
        atp.session && mutateRepost({ did: atp.session.did, post }),
    },
    {
      type: "like",
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": t("post.like.btn-label", {
        count: post.likeCount ?? 0,
      }),
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

  if (post.author.viewer?.muted) {
    return (
      <article className={clsx(styles.container, styles.muted, className)}>
        {t("post.muted-placeholder")}
      </article>
    );
  }

  return (
    <article
      className={clsx(styles.container, { [styles.link]: isLink }, className)}
      onClick={isLink ? handleClickBackground : undefined}
      id={id}
    >
      <Link to={postUrl} className={styles.focusLink}>
        {t("post.view-thread")}
      </Link>
      {!contentOnly && reason && AppBskyFeedDefs.isReasonRepost(reason) && (
        <Tag
          component={Link}
          to={profileHref(reason.by.handle)}
          colorScheme="neutral"
          size="sm"
          startDecorator={<FaRetweet />}
          onClick={(e) => e.stopPropagation()}
          className={styles.repost}
        >
          <span>
            {t("post.repost.tag", {
              actor: userToName(reason.by),
            })}
          </span>
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
            <span className={styles.name}>@{post.author.handle}</span>
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
              <span>
                {t("post.reply.tag", {
                  actor: userToName(reply.parent.author),
                })}
              </span>
            </Tag>
          )}
          <div className={styles.prose}>
            <Foldable lines={7} enabled={foldable}>
              {AppBskyFeedPost.isRecord(post.record) && (
                <RichTextRenderer {...post.record} />
              )}
            </Foldable>
          </div>
          {post.embed && (
            <Embed
              embed={post.embed}
              isLink={isEmbedLink}
              className={styles.embed}
            />
          )}
          {!contentOnly && (
            <ul className={styles.reactionList}>
              {reactions.map((reaction) => (
                <li key={reaction.type}>
                  <Reaction {...reaction} />
                </li>
              ))}
              <li>
                <PostMoreMenu
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
