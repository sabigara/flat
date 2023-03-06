import type { AppBskyActorProfile } from "@atproto/api";
import { Link, useLocation, useNavigation } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import LogoIcon from "@/src/assets/icon.svg";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@camome/core/IconButton";

import styles from "./Header.module.scss";
import Avatar from "@/src/components/Avatar";
import { queryKeys } from "@/src/lib/queries";

type Props = {
  profile: AppBskyActorProfile.View;
};

export default function Header({ profile }: Props) {
  const location = useLocation();
  const { state } = useNavigation();
  const queryClient = useQueryClient();
  const isFetchingGlobal = useIsFetching();
  const isFetchingHomeFeed = useIsFetching(queryKeys.feed.home);
  const handleClickReload = () => {
    queryClient.invalidateQueries(queryKeys.feed.home);
  };
  return (
    <header className={styles.container}>
      <div className={styles.progressBar}>
        {(state === "loading" || isFetchingGlobal) && (
          <div role="status">
            <span className="visually-hidden">データを取得中・・・</span>
          </div>
        )}
      </div>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </Link>
      {/* TODO: this may be dirty... */}
      {location.pathname === "/" && (
        <IconButton
          variant="ghost"
          size="sm"
          aria-label="更新"
          onClick={handleClickReload}
          colorScheme="neutral"
          disabled={!!isFetchingHomeFeed}
          className={styles.reloadBtn}
        >
          <TbReload />
        </IconButton>
      )}
      <Avatar size="sm" profile={profile} isLink className={styles.avatar} />
    </header>
  );
}
