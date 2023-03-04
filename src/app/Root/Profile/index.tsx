import { bsky } from "@/src/lib/atp";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Avatar } from "@camome/core/Avatar";
import { Button } from "@camome/core/Button";

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
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div className={styles.banner}>
          {profile.banner && (
            <img src={profile.banner} alt={`${username}のバナー画像`} />
          )}
        </div>
        <div className={styles.topRow}>
          <Avatar
            src={profile.avatar}
            alt={`${username}のアバター画像`}
            className={styles.avatar}
          />
          <div className={styles.actions}>
            {profile.myState?.follow ? (
              <Button colorScheme="neutral" variant="soft">
                Unfollow
              </Button>
            ) : (
              <Button>Follow</Button>
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
          <p className={styles.description}>{profile.description}</p>
        </div>
      </header>
    </article>
  );
}
