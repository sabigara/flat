import NotificationList from "@/src/components/notification/NotificationList";

import styles from "./NotificationsRoute.module.scss";

export default function NotificationsRoute() {
  return (
    <div className={styles.container}>
      <NotificationList />
    </div>
  );
}
