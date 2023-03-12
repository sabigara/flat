import { Link, useNavigation } from "react-router-dom";

import type { AppBskyActorProfile } from "@atproto/api";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import NotificationButton from "@/src/app/notification/components/NotificationButton";
import DropdownMenu from "@/src/app/root/components/DropdownMenu";
import LogoIcon from "@/src/assets/icon.svg";

import styles from "./Header.module.scss";

export default function Header() {
  const { state: navState } = useNavigation();

  return (
    <header className={styles.container}>
      <div className={styles.progressBar}>
        {navState === "loading" && (
          <div role="status">
            <span className="visually-hidden">
              次のページのデータを取得中・・・
            </span>
          </div>
        )}
      </div>
      <div className={styles.sectionStart}>
        <Link to="/" className={styles.logo}>
          <LogoIcon />
          <span className={styles.logo__text}>Flat</span>
        </Link>
      </div>
      <div className={styles.sectionEnd}>
        <NotificationButton />
        <DropdownMenu />
      </div>
    </header>
  );
}
