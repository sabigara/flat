import { AtUri } from "@atproto/uri";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import {
  LoaderFunction,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";

import { RootContext } from "@/src/app/Root/Layout";
import Avatar from "@/src/components/Avatar";
import { Feed, FeedQueryFn } from "@/src/components/Feed";
import PostComposer from "@/src/components/PostComposer";
import Prose from "@/src/components/Prose";
import { atp, bsky } from "@/src/lib/atp/atp";
import { feedItemToUniqueKey } from "@/src/lib/post";
import { queryKeys } from "@/src/lib/queries";

import styles from "./index.module.scss";

export const loader = (async ({ params }) => {
  if (!params.handle) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.actor.getProfile({
    actor: params.handle,
  });
  return resp.data;
}) satisfies LoaderFunction;

export const element = <ProfileRoute />;

function ProfileRoute() {
  const { myProfile, composer } = useOutletContext<RootContext>();
  const profile = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const username = profile.displayName ?? profile.handle;
  const queryKey = queryKeys.feed.author.$(profile.handle);
  const queryFn: FeedQueryFn<typeof queryKey> = async ({
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
    []
  );
  const revalidator = useRevalidator();
  const { mutate: mutateFollowState, isLoading: isMutating } = useMutation(
    async (isFollow: boolean) => {
      // TODO: error handling
      if (!atp.session) return;
      if (isFollow) {
        await bsky.graph.follow.create(
          { did: atp.session.did },
          {
            subject: {
              did: profile.did,
              declarationCid: profile.declaration.cid,
            },
            createdAt: new Date().toISOString(),
          }
        );
      } else {
        if (!profile.myState?.follow) return;
        const uri = new AtUri(profile.myState.follow);
        await bsky.graph.follow.delete({
          did: uri.hostname,
          rkey: uri.rkey,
        });
      }
      revalidator.revalidate();
    }
  );
  const [hoverUnfollow, setHoverUnfollow] = React.useState(false);

  const isMyself = atp.session && atp.session.did === profile.did;
  const isLoadingFollow = isMutating || revalidator.state === "loading";

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div className={styles.banner}>
          {profile.banner && (
            <img src={profile.banner} alt={`${username}のバナー画像`} />
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
                    ? "フォロー解除"
                    : "フォロー中"}
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
                <Tag size="sm" variant="soft" colorScheme="neutral">
                  フォローされています
                </Tag>
              )}
            </div>
          </hgroup>
          <dl className={styles.dl}>
            <div>
              <dt>Followers</dt>
              <dd>{profile.followersCount}</dd>
            </div>
            <div>
              <dt>Following</dt>
              <dd>{profile.followsCount}</dd>
            </div>
          </dl>
          <Prose className={styles.description}>{profile.description}</Prose>
        </div>
      </header>
      <main className={styles.main}>
        <PostComposer
          myProfile={myProfile}
          open={composer.open}
          setOpen={composer.setOpen}
          onClickCompose={composer.handleClickCompose}
          replyTarget={composer.replyTarget}
          // keep it's internal state until replyTarget changes or removed.
          key={
            composer.replyTarget && feedItemToUniqueKey(composer.replyTarget)
          }
        />
        <Feed
          queryKey={queryKey}
          queryFn={queryFn}
          fetchLatestOne={fetchLatest}
          onClickReply={composer.handleClickReply}
        />
      </main>
    </article>
  );
}

const UNFOLLOW_DESCRIBE_ID = "unfollow-describe" as const;
