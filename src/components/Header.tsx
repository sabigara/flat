import { Link, useNavigation } from "react-router-dom";

import type { AppBskyActorProfile } from "@atproto/api";

import LogoIcon from "@/src/assets/icon.svg";
import DropdownMenu from "@/src/components/DropdownMenu";
import NotificationButton from "@/src/components/notification/NotificationButton";

import styles from "./Header.module.scss";

type Props = {
  myProfile: AppBskyActorProfile.View;
};

export default function Header({ myProfile }: Props) {
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
      <div className={styles.sectionStart}>
        <Link to="/" className={styles.logo}>
          <LogoIcon />
          <span className={styles.logo__text}>Flat</span>
        </Link>
      </div>
      <div className={styles.sectionEnd}>
        <NotificationButton />
        <DropdownMenu myProfile={myProfile} />
      </div>
    </header>
  );
}
