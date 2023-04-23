import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import { Spinner } from "@camome/core/Spinner";
import { Tag } from "@camome/core/Tag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { TbDots, TbVolumeOff } from "react-icons/tb";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";

import type { ProfileRouteLoaderResult } from "@/src/app/user/routes/ProfileRoute";

import { useLightbox } from "@/src/app/content/image/hooks/useLightbox";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import {
  Timeline,
  TimelineQueryFn,
} from "@/src/app/timeline/components/Timeline";
import { TimelineFilter } from "@/src/app/timeline/components/TimelineFilter";
import { useTimelineFilter } from "@/src/app/timeline/hooks/useTimelineFilter";
import Avatar from "@/src/app/user/components/Avatar";
import { followUser } from "@/src/app/user/lib/followUser";
import { unfollowUser } from "@/src/app/user/lib/unfollowUser";
import ProfileMoreMenu from "@/src/app/user/routes/ProfileRoute/ProfileMoreMenu";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";
import { atp, bsky } from "@/src/lib/atp";

import styles from "./ProfileRoute.module.scss";

export function ProfileRoute() {
  const { profile, richText } = useLoaderData() as ProfileRouteLoaderResult;
  const username = profile.displayName ?? profile.handle;
  const queryClient = useQueryClient();
  const queryKey = queryKeys.feed.author.$(profile.handle);
  const queryFn: TimelineQueryFn<typeof queryKey> = async ({
    queryKey,
    pageParam,
  }) => {
    const resp = await bsky.feed.getAuthorFeed({
      actor: queryKey[1].authorId,
      limit: 30,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const { timelineFilter } = useTimelineFilter();
  const fetchLatest = React.useCallback(
    async () =>
      timelineFilter(
        (
          await bsky.feed.getAuthorFeed({
            actor: profile.handle,
            limit: 1,
          })
        ).data.feed
      ).at(0),
    [profile.handle, timelineFilter]
  );
  const revalidator = useRevalidator();
  const revalidate = () => {
    revalidator.revalidate();
    queryClient.invalidateQueries(queryKey);
  };
  const { mutate: mutateFollowState, isLoading: isMutating } = useMutation(
    async (isFollow: boolean) => {
      setHoverUnfollow(false);
      // TODO: error handling
      if (!atp.session) return;
      if (isFollow) {
        await followUser({
          repo: atp.session.did,
          did: profile.did,
        });
      } else {
        if (!profile.viewer?.following) return;
        await unfollowUser({ uri: profile.viewer.following });
      }
      revalidate();
    }
  );

  const { openAt } = useLightbox({
    images: profile.avatar ? [{ src: profile.avatar }] : [],
  });
  const expandAvatar = () => void openAt(0);

  const [hoverUnfollow, setHoverUnfollow] = React.useState(false);

  const isMyself = atp.session && atp.session.did === profile.did;
  const isLoadingFollow = isMutating;
  const muted = !!profile.viewer?.muted;

  return (
    <>
      <Seo
        title={`${profile.displayName ?? profile.handle}のプロフィール`}
        description={profile.description}
      />
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.banner}>
            {profile.banner && (
              <img src={profile.banner} alt={`${username}のバナー画像`} />
            )}
          </div>
          <div className={styles.topRow}>
            <button onClick={expandAvatar} aria-label="ユーザー画像を拡大">
              <Avatar
                profile={profile}
                stopPropagation={false}
                className={styles.avatar}
              />
            </button>
            <div className={styles.actions}>
              <ProfileMoreMenu
                profile={profile}
                button={
                  <IconButton
                    colorScheme="neutral"
                    variant="soft"
                    size="sm"
                    aria-label=""
                  >
                    <TbDots />
                  </IconButton>
                }
                revalidate={revalidate}
              />
              {!isMyself &&
                (profile.viewer?.following ? (
                  <Button
                    colorScheme={
                      hoverUnfollow || isLoadingFollow ? "danger" : "neutral"
                    }
                    variant="soft"
                    className={styles.followUnfollowBtn}
                    onMouseEnter={() => setHoverUnfollow(true)}
                    onMouseLeave={() => setHoverUnfollow(false)}
                    onFocus={() => setHoverUnfollow(true)}
                    onBlur={() => setHoverUnfollow(false)}
                    aria-describedby={UNFOLLOW_DESCRIBE_ID}
                    onClick={() => mutateFollowState(false)}
                    disabled={isLoadingFollow}
                    startDecorator={
                      isLoadingFollow ? <Spinner size="sm" /> : undefined
                    }
                  >
                    {hoverUnfollow ? "フォロー解除" : "フォロー中"}
                  </Button>
                ) : (
                  <Button
                    className={styles.followUnfollowBtn}
                    onClick={() => mutateFollowState(true)}
                    disabled={isLoadingFollow}
                    startDecorator={
                      isLoadingFollow ? <Spinner size="sm" /> : undefined
                    }
                  >
                    フォローする
                  </Button>
                ))}
              <span id={UNFOLLOW_DESCRIBE_ID} className="visually-hidden">
                クリックして{profile.displayName ?? profile.handle}
                さんのフォローを解除
              </span>
            </div>
          </div>
          <div className={styles.about}>
            <hgroup>
              <h1 className={styles.displayName}>{profile.displayName}</h1>
              <div className={styles.handleWrap}>
                <span className={styles.handle}>@{profile.handle}</span>
                {profile.viewer?.followedBy && (
                  <Tag
                    size="sm"
                    variant="soft"
                    colorScheme="neutral"
                    className={styles.followedTag}
                  >
                    フォローされています
                  </Tag>
                )}
              </div>
            </hgroup>
            <div className={styles.dl}>
              <Link to="followers">
                <div className={styles.term}>Followers</div>
                <div className={styles.data}>{profile.followersCount}</div>
              </Link>
              <Link to="following">
                <div className={styles.term}>Following</div>
                <div className={styles.data}>{profile.followsCount}</div>
              </Link>
            </div>
            <RichTextRenderer
              text={richText.text}
              facets={richText.facets}
              className={styles.description}
            />
          </div>
        </header>
        <div className={styles.main}>
          {muted && (
            <p className={styles.muted}>
              <TbVolumeOff aria-hidden />
              ミュート中
            </p>
          )}
          <div hidden={muted}>
            <TimelineFilter />
            <Timeline
              queryKey={queryKey}
              queryFn={queryFn}
              fetchNewLatest={fetchLatest}
              filter={timelineFilter}
            />
          </div>
        </div>
      </article>
    </>
  );
}

const UNFOLLOW_DESCRIBE_ID = "unfollow-describe" as const;
