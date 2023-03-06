import { bsky } from "@/src/lib/atp/atp";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Button } from "@camome/core/Button";
import Prose from "@/src/components/Prose";
import Avatar from "@/src/components/Avatar";
import { Feed, FeedQueryFn } from "@/src/app/Root/Feed";
import { queryKeys } from "@/src/lib/queries";

import styles from "./index.module.scss";

export const loader = (async ({ params }) => {
  if (!params.userId) {
    throw new Error("Invalid params");
  }
  const resp = await bsky.actor.getProfile({
    actor: `${params.userId}.bsky.social`,
  });

  return resp.data;
}) satisfies LoaderFunction;

export const element = <ProfileRoute />;

function ProfileRoute() {
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
  const fetchLatest = async () =>
    (
      await bsky.feed.getAuthorFeed({
        author: profile.handle,
        limit: 1,
      })
    ).data.feed[0];

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
            {profile.myState?.follow ? (
              <Button
                colorScheme="neutral"
                variant="soft"
                className={styles.followUnfollowBtn}
              >
                フォロー解除
              </Button>
            ) : (
              <Button className={styles.followUnfollowBtn}>フォローする</Button>
            )}
          </div>
        </div>
        <div className={styles.about}>
          <hgroup>
            <h1 className={styles.displayName}>{profile.displayName}</h1>
            <p className={styles.handle}>@{profile.handle}</p>
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
        <Feed
          queryKey={queryKey}
          queryFn={queryFn}
          fetchLatestOne={fetchLatest}
        />
      </main>
    </article>
  );
}
