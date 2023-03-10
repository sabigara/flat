import { AppBskyActorRef } from "@atproto/api";
import { Button, ButtonProps } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Tag } from "@camome/core/Tag";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Link } from "react-router-dom";

import Avatar from "@/src/components/Avatar";
import { atp } from "@/src/lib/atp/atp";
import { followUser, unfollowUser } from "@/src/lib/atp/graph";

import styles from "./UserListItem.module.scss";

type Props = {
  user: AppBskyActorRef.WithInfo;
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
          did: atp.session.did,
          subject: {
            did: user.did,
            declarationCid: user.declaration.cid,
          },
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
      <div>
        <Avatar profile={user} isLink className={styles.avatar} />
      </div>
      <div className={styles.sectionCenter}>
        <Link to={`/${user.handle}`} className={"clickable-overlay"}>
          {user.displayName && (
            <div className={styles.displayName}>{user.displayName}</div>
          )}
          <div className={styles.handle}>@{user.handle}</div>
        </Link>
        <div>
          {user.viewer?.followedBy && (
            <Tag
              variant="soft"
              colorScheme="neutral"
              size="sm"
              className={styles.tag}
            >
              フォローされています
            </Tag>
          )}
        </div>
      </div>
      <div>
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
