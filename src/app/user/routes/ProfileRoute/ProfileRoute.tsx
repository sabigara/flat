import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";

import type { ProfileRouteLoaderResult } from "@/src/app/user/routes/ProfileRoute";

import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import {
  Timeline,
  TimelineQueryFn,
} from "@/src/app/timeline/components/Timeline";
import Avatar from "@/src/app/user/components/Avatar";
import { followUser } from "@/src/app/user/lib/followUser";
import { unfollowUser } from "@/src/app/user/lib/unfollowUser";
import Prose from "@/src/components/Prose";
import { atp, bsky } from "@/src/lib/atp";

import styles from "./ProfileRoute.module.scss";

export function ProfileRoute() {
  const profile = useLoaderData() as ProfileRouteLoaderResult;
  const username = profile.displayName ?? profile.handle;
  const queryKey = queryKeys.feed.author.$(profile.handle);
  const queryFn: TimelineQueryFn<typeof queryKey> = async ({
    queryKey,
    pageParam,
  }) => {
    const resp = await bsky.feed.getAuthorFeed({
      author: queryKey[1].authorId,
      limit: 20,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { before: pageParam.cursor } : {}),
    });
    // TODO: ?????
    if (!resp.success) throw new Error("Fetch error");
    return resp.data;
  };
  const fetchLatest = React.useCallback(
    async () =>
      (
        await bsky.feed.getAuthorFeed({
          author: profile.handle,
          limit: 1,
        })
      ).data.feed[0],
    [profile.handle]
  );
  const revalidator = useRevalidator();
  const { mutate: mutateFollowState, isLoading: isMutating } = useMutation(
    async (isFollow: boolean) => {
      // TODO: error handling
      if (!atp.session) return;
      if (isFollow) {
        await followUser({
          did: atp.session.did,
          subject: {
            did: profile.did,
            declarationCid: profile.declaration.cid,
          },
        });
      } else {
        if (!profile.myState?.follow) return;
        await unfollowUser({ uri: profile.myState.follow });
      }
      revalidator.revalidate();
    }
  );
  const [hoverUnfollow, setHoverUnfollow] = React.useState(false);

  const isMyself = atp.session && atp.session.did === profile.did;
  const isLoadingFollow = isMutating || revalidator.state === "loading";

  return (
    <>
      <Seo
        title={`${profile.displayName ?? profile.handle}?????????????????????`}
        description={profile.description}
      />
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.banner}>
            {profile.banner && (
              <img src={profile.banner} alt={`${username}??????????????????`} />
            )}
          </div>
          <div className={styles.topRow}>
            <Avatar profile={profile} className={styles.avatar} />
            <div className={styles.actions}>
              {!isMyself &&
                (profile.myState?.follow ? (
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
                    {hoverUnfollow || isLoadingFollow
                      ? "??????????????????"
                      : "???????????????"}
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
                    ??????????????????
                  </Button>
                ))}
              <span id={UNFOLLOW_DESCRIBE_ID} className="visually-hidden">
                ??????????????????{profile.displayName ?? profile.handle}
                ??????????????????????????????
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
                    ??????????????????????????????
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
            <Prose className={styles.description}>{profile.description}</Prose>
          </div>
        </header>
        <main className={styles.main}>
          <Timeline
            queryKey={queryKey}
            queryFn={queryFn}
            fetchLatestOne={fetchLatest}
          />
        </main>
      </article>
    </>
  );
}

const UNFOLLOW_DESCRIBE_ID = "unfollow-describe" as const;
