import { IconButton } from "@camome/core/IconButton";
import { Tag } from "@camome/core/Tag";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { TbBan, TbDots, TbVolumeOff } from "react-icons/tb";
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useRevalidator,
} from "react-router-dom";

import type { ProfileRouteLoaderResult } from "@/src/app/user/routes/ProfileRoute";

import { useAtpAgent } from "@/src/app/account/states/atp";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { useLightbox } from "@/src/app/content/image/hooks/useLightbox";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import Avatar from "@/src/app/user/components/Avatar";
import { FollowButton } from "@/src/app/user/components/FollowButton";
import ProfileMoreMenu from "@/src/app/user/components/ProfileMoreMenu";
import { ProfileTabLinks } from "@/src/app/user/components/ProfileTabLinks";
import { userToName } from "@/src/app/user/lib/userToName";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";

import styles from "./ProfileRoute.module.scss";

export function ProfileRoute() {
  const { t } = useTranslation();
  const { t: usersT } = useTranslation("users");
  const { mode } = useAtomValue(settingsAtom);
  const isZenMode = mode === "zen";
  const { profile, richText } = useLoaderData() as ProfileRouteLoaderResult;
  const username = userToName(profile);
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  const revalidate = () => {
    const invalidate = (identifier: string) =>
      queryClient.invalidateQueries(
        queryKeys.users.single.$({
          identifier,
        }),
      );
    invalidate(profile.handle);
    invalidate(profile.did);
    revalidator.revalidate();
  };

  const { openAt } = useLightbox({
    images: profile.avatar ? [{ src: profile.avatar }] : [],
  });
  const expandAvatar = () => void openAt(0);

  const atp = useAtpAgent();
  const isMyself = !!atp.session && atp.session.did === profile.did;
  const isMuted = !!profile.viewer?.muted;
  const isBlocked = !!profile.viewer?.blockedBy;
  const isBlocking = !!profile.viewer?.blocking;

  return (
    <>
      <Seo
        title={usersT("profile.title", { actor: username })}
        description={profile.description}
      />
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.banner}>
            {profile.banner && (
              <img
                src={profile.banner}
                alt={usersT("profile.banner-alt", { actor: username })}
              />
            )}
          </div>
          <div className={styles.topRow}>
            <button
              onClick={expandAvatar}
              aria-label={usersT("profile.expand-avatar", { actor: username })}
              className={styles.avatarWrap}
            >
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
              {!isMyself && (
                <FollowButton
                  profile={profile}
                  size="md"
                  onSuccess={revalidate}
                />
              )}
              <span id={UNFOLLOW_DESCRIPTION_ID} className="visually-hidden">
                {usersT("profile.unfollow-description", { actor: username })}
              </span>
            </div>
          </div>
          <div className={styles.about}>
            <hgroup>
              <h1 className={styles.displayName}>{profile.displayName}</h1>
              <div className={styles.handleWrap}>
                <span className={styles.handle}>@{profile.handle}</span>
                {!isZenMode && profile.viewer?.followedBy && (
                  <Tag
                    size="sm"
                    variant="soft"
                    colorScheme="neutral"
                    className={styles.followedTag}
                  >
                    {t("graph.follows-you")}
                  </Tag>
                )}
              </div>
            </hgroup>
            {!isZenMode && (
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
            )}
            <RichTextRenderer
              text={richText.text}
              facets={richText.facets}
              className={styles.description}
            />
          </div>
        </header>
        <div className={styles.main}>
          {isMuted && !isBlocked && !isBlocking && (
            <p className={styles.muted}>
              <TbVolumeOff aria-hidden />
              {t("graph.muted")}
            </p>
          )}
          {(isBlocked || isBlocking) && (
            <p className={styles.muted}>
              <TbBan aria-hidden />
              {isBlocking ? t("graph.blocking") : t("graph.blocked")}
            </p>
          )}
          {!isMuted && !isBlocked && !isBlocking && (
            <div>
              <ProfileTabLinks
                showLikes={isMyself}
                className={styles.tabLinks}
              />
              <hr className={styles.hr} />
              <Outlet context={{ profile, richText }} />
            </div>
          )}
        </div>
      </article>
    </>
  );
}

type ProfileOutletCtx = ProfileRouteLoaderResult;

export function useProfileOutletCtx() {
  return useOutletContext<ProfileOutletCtx>();
}

const UNFOLLOW_DESCRIPTION_ID = "unfollow-describe" as const;
