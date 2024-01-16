import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Draft } from "immer";
import { useAtomValue } from "jotai";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Trans, useTranslation } from "react-i18next";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { TbDots, TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import { getAtpAgent, getBskyApi } from "@/src/app/account/states/atp";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import PostMoreMenu from "@/src/app/post/components/PostMoreMenu";
import Embed from "@/src/app/post/components/embed/Embed";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import { MutatePostCache } from "@/src/app/post/lib/types";
import { formatDistanceShort } from "@/src/app/time/lib/time";
import Avatar from "@/src/app/user/components/Avatar";
import UserPopover from "@/src/app/user/components/UserPopover";
import { userToName } from "@/src/app/user/lib/userToName";
import { Foldable } from "@/src/components/Foldable";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";
import { isModKey } from "@/src/lib/keybindings";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedDefs.FeedViewPost;
  contentOnly?: boolean;
  isLink?: boolean;
  isEmbedLink?: boolean;
  revalidate?: () => void;
  mutatePostCache?: MutatePostCache;
  foldable?: boolean;
  line?: { up: boolean; down: boolean };
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
  line,
  id,
  className,
}: Props) {
  const { t } = useTranslation();
  const { mode } = useAtomValue(settingsAtom);
  const isZenMode = mode === "zen";
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
  const authorId = React.useId();
  const contentId = React.useId();

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
        await getBskyApi().feed.repost.delete({
          repo: uri.hostname,
          rkey: uri.rkey,
        });
      } else {
        const resp = await getBskyApi().feed.repost.create(
          {
            repo: did,
          },
          {
            subject: {
              cid: post.cid,
              uri: post.uri,
            },
            createdAt: new Date().toISOString(),
          },
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
    },
  );

  const { mutate: mutateVote, isLoading: isMutatingLike } = useMutation(
    async ({ did, post }: { did: string; post: AppBskyFeedDefs.PostView }) => {
      let likeUri: string | undefined = undefined;
      if (post.viewer?.like) {
        const uri = new AtUri(post.viewer.like);
        await getBskyApi().feed.like.delete({
          repo: uri.hostname,
          rkey: uri.rkey,
        });
      } else {
        const resp = await getBskyApi().feed.like.create(
          {
            repo: did,
          },
          {
            subject: {
              cid: post.cid,
              uri: post.uri,
            },
            createdAt: new Date().toISOString(),
          },
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
    },
  );

  // TODO: consider about encoding
  const profileHref = (handle: string) => `/${handle}`;

  const reactions = [
    {
      type: "reply",
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": isZenMode
        ? t("post.reply.title")
        : t("post.reply.btn-label", {
            count: post.replyCount ?? 0,
          }),
      count: post.replyCount ?? 0,
      showCount: true,
      onClick: () => handleClickReply(data),
      reacted: false,
    },
    {
      type: "repost",
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": isZenMode
        ? t("post.repost.title")
        : t("post.repost.btn-label", {
            count: post.repostCount ?? 0,
          }),
      count: post.repostCount ?? 0,
      showCount: !isZenMode,
      reacted: reposted,
      disabled: isMutatingRepost,
      onClick: () => {
        const atp = getAtpAgent();
        atp.session && mutateRepost({ did: atp.session.did, post });
      },
    },
    {
      type: "like",
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": isZenMode
        ? t("post.like.title")
        : t("post.like.btn-label", {
            count: post.likeCount ?? 0,
          }),
      count: post.likeCount ?? 0,
      showCount: !isZenMode,
      reacted: liked,
      disabled: isMutatingLike,
      onClick: () => {
        const atp = getAtpAgent();
        atp.session && mutateVote({ did: atp.session.did, post });
      },
    },
  ] satisfies ReactionProps[];

  const postUrl = buildPostUrl({
    handle: post.author.handle,
    uri: post.uri,
  });

  const handleClickBackground: React.MouseEventHandler = (e) => {
    if (isModKey(e.nativeEvent)) {
      window.open(postUrl, "_blank");
    } else {
      navigate(postUrl);
    }
  };

  const hotkeyRef = useHotkeys("Enter", () => {
    navigate(postUrl);
  });

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
      aria-labelledby={[authorId, contentId].join(" ")}
      tabIndex={0}
      ref={hotkeyRef}
      data-post
    >
      {!contentOnly &&
        reason &&
        AppBskyFeedDefs.isReasonRepost(reason) &&
        !line?.up && (
          <Tag
            component={Link}
            to={profileHref(reason.by.handle)}
            colorScheme="neutral"
            size="sm"
            startDecorator={<FaRetweet />}
            onClick={(e) => e.stopPropagation()}
            className={styles.repost}
          >
            <Trans
              i18nKey="post.repost.tag"
              components={{
                wrap: <span className={styles.tagActor} />,
              }}
              values={{ actor: userToName(reason.by) }}
            />
          </Tag>
        )}
      <div className={styles.main}>
        <div className={styles.left}>
          {/* Use handle as identifier to share the cache with the loader for PostRoute */}
          <UserPopover identifier={post.author.handle} placement="bottom-start">
            <Avatar
              isLink
              profile={post.author}
              size="sm"
              className={styles.avatar}
            />
          </UserPopover>
          {!!line?.up && <div className={styles["line--up"]} />}
          {!!line?.down && <div className={styles["line--down"]} />}
        </div>
        <div className={styles.right}>
          <div className={styles.header}>
            {/* TODO: fix overflow */}
            <UserPopover
              identifier={post.author.handle}
              placement="bottom-start"
            >
              <Link
                to={profileHref(post.author.handle)}
                onClick={(e) => e.stopPropagation()}
                className={styles.usernameLink}
                id={authorId}
              >
                <div className={styles.usernameInner}>
                  {post.author.displayName && (
                    <span className={styles.displayName}>
                      {post.author.displayName}
                    </span>
                  )}
                  <span className={styles.handle}>@{post.author.handle}</span>
                </div>
              </Link>
            </UserPopover>
            <time dateTime={post.indexedAt} className={styles.time}>
              {formatDistanceShort(new Date(post.indexedAt))}
            </time>
          </div>
          {/* Don't show tag if the line explains it's a thread */}
          {!contentOnly && reply && !line?.up && (
            <Tag
              colorScheme="neutral"
              size="sm"
              startDecorator={<BsReplyFill />}
              className={styles.reply}
            >
              <Trans
                i18nKey="post.reply.tag"
                components={{
                  wrap: <span className={styles.tagActor} />,
                }}
                values={{
                  actor: AppBskyFeedDefs.isPostView(reply.parent)
                    ? userToName(reply.parent.author)
                    : "",
                }}
              />
            </Tag>
          )}
          <div className={styles.content}>
            {AppBskyFeedPost.isRecord(post.record) && post.record.text && (
              <div className={styles.prose} id={contentId}>
                <Foldable lines={7} enabled={foldable}>
                  <RichTextRenderer {...post.record} />
                </Foldable>
              </div>
            )}
            {post.embed && (
              <Embed
                embed={post.embed}
                isLink={isEmbedLink}
                className={styles.embed}
              />
            )}
          </div>
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
  showCount: boolean;
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
  showCount,
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
      <span aria-hidden className={styles.reaction__count}>
        {showCount && count > 0 && count}
      </span>
    </button>
  );
}
