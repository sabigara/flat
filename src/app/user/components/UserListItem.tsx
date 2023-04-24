import { AppBskyActorDefs } from "@atproto/api";
import { Button, ButtonProps } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Link } from "react-router-dom";

import Avatar from "@/src/app/user/components/Avatar";
import { followUser } from "@/src/app/user/lib/followUser";
import { unfollowUser } from "@/src/app/user/lib/unfollowUser";
import { atp } from "@/src/lib/atp";

import styles from "./UserListItem.module.scss";

type Props = {
  user: AppBskyActorDefs.ProfileViewDetailed;
  revalidate?: () => void;
  className?: string;
};

export default function UserListItem({ user, revalidate, className }: Props) {
  const { mutate: mutateFollowState, isLoading: isMutating } = useMutation(
    async (isFollow: boolean) => {
      // TODO: error handling
      if (!atp.session) return;
      if (isFollow) {
        await followUser({
          repo: atp.session.did,
          did: user.did,
        });
      } else {
        if (!user.viewer?.following) return;
        await unfollowUser({ uri: user.viewer.following });
      }
      revalidate?.();
    }
  );

  const loading = isMutating;
  const buttonProps = {
    size: "sm",
    disabled: loading,
    startDecorator: loading ? <Spinner size="sm" /> : undefined,
  } satisfies ButtonProps;

  return (
    <article className={clsx(styles.container, className)}>
      <div className={styles.leftSection}>
        <div className={styles.avatar}>
          <Avatar profile={user} />
        </div>
        <Link
          to={`/${user.handle}`}
          className={clsx("clickable-overlay", styles.names)}
        >
          <div className={styles.names__inner}>
            {user.displayName && (
              <div className={styles.displayName}>{user.displayName}</div>
            )}
            <div className={styles.handle}>@{user.handle}</div>
          </div>
        </Link>
        <div className={styles.description}>{user.description}</div>
      </div>
      <div className={styles.button}>
        {user.viewer?.following ? (
          <Button
            variant="soft"
            colorScheme="neutral"
            onClick={() => mutateFollowState(false)}
            {...buttonProps}
          >
            フォロー解除
          </Button>
        ) : (
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={() => mutateFollowState(true)}
            {...buttonProps}
          >
            フォローする
          </Button>
        )}
      </div>
    </article>
  );
}
