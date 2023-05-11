import { AppBskyActorDefs } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";

import { getAtpAgent } from "@/src/app/account/states/atp";
import { followUser } from "@/src/app/user/lib/followUser";
import { unfollowUser } from "@/src/app/user/lib/unfollowUser";
import { userToName } from "@/src/app/user/lib/userToName";
import { isButtonLoading } from "@/src/components/isButtonLoading";

import styles from "./FollowButton.module.scss";

type Props = {
  profile: AppBskyActorDefs.ProfileViewDetailed;
  size: "sm" | "md" | "lg";
  onSuccess?: () => void;
  className?: string;
};

export function FollowButton({ profile, size, onSuccess, className }: Props) {
  const { t } = useTranslation();
  const { t: usersT } = useTranslation("users");
  const [hoverUnfollow, setHoverUnfollow] = React.useState(false);

  const { mutate, isLoading: isMutating } = useMutation({
    mutationFn: async (params: {
      isFollow: boolean;
      profile: AppBskyActorDefs.ProfileViewDetailed;
    }) => {
      const atp = getAtpAgent();
      // TODO: error handling
      if (!atp.session) return;
      if (params.isFollow) {
        await followUser({
          repo: atp.session.did,
          did: params.profile.did,
        });
      } else {
        if (!params.profile.viewer?.following) return;
        await unfollowUser({ uri: params.profile.viewer.following });
      }
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleClickFollow = () => {
    if (!profile) return;
    mutate({ isFollow: true, profile });
  };

  const handleClickUnfollow = () => {
    if (!profile) return;
    mutate({ isFollow: false, profile });
  };

  const isLoadingFollow = isMutating;

  return profile.viewer?.following ? (
    <>
      <Button
        size={size}
        colorScheme={hoverUnfollow || isLoadingFollow ? "danger" : "neutral"}
        variant="soft"
        onMouseEnter={() => setHoverUnfollow(true)}
        onMouseLeave={() => setHoverUnfollow(false)}
        onFocus={() => setHoverUnfollow(true)}
        onBlur={() => setHoverUnfollow(false)}
        aria-describedby={UNFOLLOW_DESCRIPTION_ID}
        onClick={handleClickUnfollow}
        {...isButtonLoading(isMutating)}
        className={clsx(styles.button, className)}
      >
        {hoverUnfollow ? t("graph.unfollow") : t("graph.following")}
      </Button>
      <span id={UNFOLLOW_DESCRIPTION_ID} className="visually-hidden">
        {usersT("profile.unfollow-description", { actor: userToName(profile) })}
      </span>
    </>
  ) : (
    <Button
      size={size}
      onClick={handleClickFollow}
      {...isButtonLoading(isMutating)}
      className={clsx(styles.button, className)}
    >
      {t("graph.follow")}
    </Button>
  );
}

const UNFOLLOW_DESCRIPTION_ID = "unfollow-describe" as const;
