import { useOutletContext } from "react-router-dom";

import { RootContext } from "@/src/app/Root/Layout";
import NotificationList from "@/src/components/notification/NotificationList";

import styles from "./NotificationsRoute.module.scss";

export default function NotificationsRoute() {
  const {
    composer: { handleClickReply },
  } = useOutletContext<RootContext>();
  return (
    <div className={styles.container}>
      <NotificationList onClickReply={handleClickReply} />
    </div>
  );
}
