import { AppBskyActorDefs } from "@atproto/api";
import {
  Avatar as CmmAvatar,
  type AvatarProps as CmmAvatarProps,
} from "@camome/core/Avatar";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./Avatar.module.scss";

type Props = {
  profile?: Pick<
    AppBskyActorDefs.ProfileViewBasic,
    "avatar" | "displayName" | "handle"
  >;
  isLink?: boolean;
  to?: string;
  innerRef?: React.Ref<HTMLImageElement | HTMLAnchorElement>;
  stopPropagation?: boolean;
} & CmmAvatarProps;

export default function Avatar({
  profile,
  isLink,
  to,
  innerRef,
  stopPropagation = true,
  ...props
}: Props) {
  const linkProps = {
    component: Link,
    to: to ?? `/${profile?.handle}`,
  };
  return (
    // @ts-ignore
    <CmmAvatar
      {...(isLink ? linkProps : {})}
      src={profile?.avatar}
      alt={`${profile?.displayName ?? profile?.handle}のアバター画像`}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      ref={innerRef}
      {...props}
    >
      <span className={styles.fallback}>
        {typeof profile?.handle === "string"
          ? profile.handle.at(0)?.toUpperCase()
          : ""}
      </span>
    </CmmAvatar>
  );
}
