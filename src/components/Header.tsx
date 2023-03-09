import { IconButton } from "@camome/core/IconButton";
import { TbQuestionMark } from "react-icons/tb";
import { Link, useNavigation } from "react-router-dom";

import type { AppBskyActorProfile } from "@atproto/api";

import LogoIcon from "@/src/assets/icon.svg";
import Avatar from "@/src/components/Avatar";

import styles from "./Header.module.scss";

type Props = {
  profile: AppBskyActorProfile.View;
};

export default function Header({ profile }: Props) {
  const { state } = useNavigation();

  return (
    <header className={styles.container}>
      <div className={styles.progressBar}>
        {state === "loading" && (
          <div role="status">
            <span className="visually-hidden">
              次のページのデータを取得中・・・
            </span>
          </div>
        )}
      </div>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </Link>
      <div className={styles.sectionEnd}>
        <IconButton
          component={Link}
          to="/about"
          aria-label="About"
          size="sm"
          colorScheme="neutral"
          variant="soft"
          className={styles.aboutBtn}
        >
          <TbQuestionMark />
        </IconButton>
        <Avatar size="sm" profile={profile} isLink className={styles.avatar} />
      </div>
    </header>
  );
}
