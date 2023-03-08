import { formatDistanceShort } from "@/src/lib/time";
import { AppBskyFeedFeedViewPost, AppBskyFeedGetTimeline } from "@atproto/api";
import { TbMessageCircle2, TbStar, TbStarFilled } from "react-icons/tb";
import { BsReplyFill } from "react-icons/bs";
import { FaRetweet } from "react-icons/fa";
import { Tag } from "@camome/core/Tag";
import { Link } from "react-router-dom";
import Prose from "@/src/components/Prose";
import Avatar from "@/src/components/Avatar";
import { atp, bsky } from "@/src/lib/atp/atp";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import Embed from "@/src/components/embed/Embed";
import { queryKeys } from "@/src/lib/queries";
import { produce, Draft } from "immer";
import { AtUri } from "@atproto/uri";

import styles from "./Post.module.scss";

type Props = {
  data: AppBskyFeedFeedViewPost.Main;
};

export default function Post({ data }: Props) {
  const { post, reason, reply } = data;
  const queryClient = useQueryClient();
  const [optimisticallyUpvoted, setOptimisticallyUpvoted] = React.useState<
    boolean | undefined
  >(undefined);

  const upvoted =
    optimisticallyUpvoted === undefined
      ? !!post.viewer.upvote
      : optimisticallyUpvoted;

  const { mutate: mutateRepost } = useMutation(
    async () => {
      let repostUri: string | undefined = undefined;
      if (post.viewer.repost) {
        const uri = new AtUri(post.viewer.repost);
        await bsky.feed.repost.delete({
          did: uri.hostname,
          rkey: uri.rkey,
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
        repostUri = resp.uri;
      }
      return { repostUri };
    },
    {
      onSuccess({ repostUri }) {
        const updateRepost = (draft: Draft<AppBskyFeedFeedViewPost.Main>) => {
          draft.post.repostCount += repostUri ? +1 : -1;
          draft.post.viewer.repost = repostUri;
        };
        queryClient.setQueryData<TimelineInfiniteData>(
          queryKeys.feed.home.$,
          (data) => mutateTimelineItem(data, post.cid, updateRepost)
        );
        queryClient.setQueryData<TimelineInfiniteData>(
          queryKeys.feed.author.$(atp.session!.handle),
          (data) => mutateTimelineItem(data, post.cid, updateRepost)
        );
      },
    }
  );

  // ideally cancel queries?
  // https://tanstack.com/query/v4/docs/react/guides/optimistic-updates#updating-a-list-of-todos-when-adding-a-new-todo
  const { mutate: mutateVote } = useMutation(
    async () => {
      const resp = await bsky.feed.setVote({
        direction: upvoted ? "none" : "up",
        subject: {
          cid: post.cid,
          uri: post.uri,
        },
      });
      // TODO: error handling
      return { upvoteUri: resp.data.upvote };
    },
    {
      onMutate() {
        setOptimisticallyUpvoted(!upvoted);
      },
      onSuccess({ upvoteUri }) {
        const updateVote = (draft: Draft<AppBskyFeedFeedViewPost.Main>) => {
          draft.post.upvoteCount += upvoteUri ? +1 : -1;
          draft.post.viewer.upvote = upvoteUri;
        };
        queryClient.setQueryData<TimelineInfiniteData>(
          queryKeys.feed.home.$,
          (data) => mutateTimelineItem(data, post.cid, updateVote)
        );
        queryClient.setQueryData<TimelineInfiniteData>(
          queryKeys.feed.author.$(atp.session!.handle),
          (data) => mutateTimelineItem(data, post.cid, updateVote)
        );
        setOptimisticallyUpvoted(undefined);
      },
    }
  );

  // TODO: consider about encoding
  const profileHref = (handle: string) => `/${handle}`;

  const reactions: ReactionProps[] = [
    {
      type: "reply",
      icon: <TbMessageCircle2 />,
      iconReacted: <TbMessageCircle2 />,
      "aria-label": `${post.replyCount}件の返信`,
      count: post.replyCount,
      reacted: false,
    },
    {
      type: "repost",
      icon: <FaRetweet />,
      iconReacted: <FaRetweet style={{ color: "#22c55e" }} />,
      "aria-label": `${post.replyCount}件のリポスト`,
      count: post.repostCount,
      reacted: !!post.viewer.repost,
      onClick: mutateRepost,
    },
    {
      type: "upvote",
      icon: <TbStar />,
      iconReacted: <TbStarFilled style={{ color: "#eab308" }} />,
      "aria-label": `${post.replyCount}件のいいね`,
      count: post.upvoteCount + ternaryToCount(optimisticallyUpvoted),
      reacted: upvoted,
      onClick: mutateVote,
    },
  ];

  return (
    <article className={styles.container}>
      {reason && AppBskyFeedFeedViewPost.isReasonRepost(reason) && (
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
          {reply && (
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
          <ul className={styles.reactionList}>
            {reactions.map((reaction) => (
              <Reaction {...reaction} key={reaction.type} />
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
      className={styles.reaction}
    >
      <span className={styles.reaction__icon}>
        {reacted ? iconReacted : icon}
      </span>
      <span aria-hidden>{count}</span>
    </button>
  );
}

type TimelineInfiniteData = InfiniteData<AppBskyFeedGetTimeline.OutputSchema>;

function mutateTimelineItem(
  data: TimelineInfiniteData | undefined,
  postCid: string,
  fn: (draft: Draft<AppBskyFeedFeedViewPost.Main>) => void
) {
  if (!data) return { pageParams: [], pages: [] };
  return produce(data, (draft) => {
    const target = draft.pages
      .flatMap((p) => p.feed)
      .find((item) => item.post.cid === postCid);
    if (!target) return data;
    fn(target);
  });
}

const ternaryToCount = (val: boolean | undefined) => {
  if (val === undefined) return 0;
  return val ? 1 : -1;
};
