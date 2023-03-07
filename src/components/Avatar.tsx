import {
  Avatar as CmmAvatar,
  type AvatarProps as CmmAvatarProps,
} from "@camome/core/Avatar";
import { AppBskyActorProfile } from "@atproto/api";

import styles from "./Avatar.module.scss";
import { Link } from "react-router-dom";

type Props = {
  profile: Pick<AppBskyActorProfile.View, "avatar" | "displayName" | "handle">;
  isLink?: boolean;
} & CmmAvatarProps;

export default function Avatar({ profile, isLink, ...props }: Props) {
  const linkProps = {
    component: Link,
    to: `/${profile.handle}`,
  };
  return (
    // @ts-ignore
    <CmmAvatar
      {...(isLink ? linkProps : {})}
      src={profile.avatar}
      alt={`${profile.displayName ?? profile.handle}のアバター画像`}
      {...props}
      children={
        <span className={styles.fallback}>
          {profile.handle.at(0)?.toUpperCase()}
        </span>
      }
    />
  );
}
