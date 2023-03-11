import { useOutletContext } from "react-router-dom";

import { RootContext } from "@/src/app/Root/Layout";
import NotificationList from "@/src/components/notification/NotificationList";
import Seo from "@/src/seo/Seo";

import styles from "./NotificationsRoute.module.scss";

export default function NotificationsRoute() {
  const {
    composer: { handleClickReply },
  } = useOutletContext<RootContext>();
  return (
    <>
      <Seo title="通知" />
      <div className={styles.container}>
        <NotificationList onClickReply={handleClickReply} />
      </div>
    </>
  );
}
