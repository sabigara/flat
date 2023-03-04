import type { AppBskyActorProfile } from "@atproto/api";
import { Link } from "react-router-dom";
import LogoIcon from "@/src/assets/logo-icon.svg";
import { Avatar } from "@camome/core/Avatar";

import styles from "./Header.module.scss";
import PostComposer from "@/src/app/Root/PostComposer";

type Props = {
  profile: AppBskyActorProfile.View;
};

export default function Header({ profile }: Props) {
  return (
    <header className={styles.container}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </Link>
      <PostComposer profile={profile} />
      <Avatar
        component={Link}
        size="sm"
        to={`/${profile.handle.replace(".bsky.social", "")}`}
        src={profile.avatar}
        className={styles.avatar}
      />
    </header>
  );
}
