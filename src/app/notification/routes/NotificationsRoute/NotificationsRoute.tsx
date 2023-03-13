import NotificationList from "@/src/app/notification/components/NotificationList";
import Seo from "@/src/app/seo/Seo";

import styles from "./NotificationsRoute.module.scss";

export default function NotificationsRoute() {
  return (
    <>
      <Seo title="通知" />
      <div className={styles.container}>
        <NotificationList />
      </div>
    </>
  );
}
