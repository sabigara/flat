import { useTranslation } from "react-i18next";

import NotificationList from "@/src/app/notification/components/NotificationList";
import Seo from "@/src/app/seo/Seo";

import styles from "./NotificationsRoute.module.scss";

export default function NotificationsRoute() {
  const { t } = useTranslation("notification");
  return (
    <>
      <Seo title={t("title")} />
      <div className={styles.container}>
        <NotificationList />
      </div>
    </>
  );
}
