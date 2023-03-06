import type { AppBskyActorProfile } from "@atproto/api";
import { Link, useNavigation } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import { Avatar } from "@camome/core/Avatar";
import LogoIcon from "@/src/assets/icon.svg";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@camome/core/IconButton";

import styles from "./Header.module.scss";

type Props = {
  profile: AppBskyActorProfile.View;
};

export default function Header({ profile }: Props) {
  const { state } = useNavigation();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching(["home-timeline"]);
  const handleClickReload = () => {
    queryClient.invalidateQueries(["home-timeline"]);
  };
  return (
    <header className={styles.container}>
      <div className={styles.progressBar}>
        {(state === "loading" || isFetching) && (
          <div role="status">
            <span className="visually-hidden">データを取得中・・・</span>
          </div>
        )}
      </div>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </Link>
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="更新"
        onClick={handleClickReload}
        colorScheme="neutral"
        disabled={!!isFetching}
        className={styles.reloadBtn}
      >
        <TbReload />
      </IconButton>
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
