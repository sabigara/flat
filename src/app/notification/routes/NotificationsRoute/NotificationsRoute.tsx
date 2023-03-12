import { useOutletContext } from "react-router-dom";

import NotificationList from "@/src/app/notification/components/NotificationList";
import { RootContext } from "@/src/app/root/routes/RootRoute/RootRoute";
import Seo from "@/src/app/seo/Seo";

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
