import { IconButton } from "@camome/core/IconButton";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { TbSearch } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

import { reloadFeedForNewPosts } from "@/src/app/feed/lib/reloadFeedForNewPosts";
import NotificationButton from "@/src/app/notification/components/NotificationButton";
import DropdownMenu from "@/src/app/root/components/DropdownMenu";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import LogoIcon from "@/src/assets/icon.svg";

import styles from "./MobileNav.module.scss";

export default function MobileNav() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const location = useLocation();
  const handleClickLogo = () => {
    if (location.pathname === "/") {
      reloadFeedForNewPosts(queryClient, queryKeys.feed.home.$);
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.sectionStart}>
        <Link to="/" onClick={handleClickLogo} className={styles.logo}>
          <LogoIcon />
          <span className={styles.logo__text}>Flat</span>
        </Link>
      </div>
      <div className={styles.sectionEnd}>
        <IconButton
          component={Link}
          to="/search"
          aria-label={t("search.title")}
          colorScheme="neutral"
          variant="ghost"
          className={styles.button}
        >
          <TbSearch />
        </IconButton>
        <NotificationButton />
        <DropdownMenu />
      </div>
    </header>
  );
}
