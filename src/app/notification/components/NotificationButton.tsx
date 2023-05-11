import { IconButton } from "@camome/core/IconButton";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { RiNotification2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";

import styles from "./NotificationButton.module.scss";

type Props = {
  className?: string;
};

export default function NotificationButton({ className }: Props) {
  const { data: count } = useQuery({
    queryKey: queryKeys.notifications.count.$,
    async queryFn() {
      const resp = await getBskyApi().notification.getUnreadCount();
      return resp.data.count;
    },
    refetchInterval: 60 * 1 * 1000, // 1 minute
    refetchOnWindowFocus: import.meta.env.PROD,
  });

  return (
    <IconButton
      component={Link}
      to="/notifications"
      aria-label="通知を表示"
      colorScheme="neutral"
      variant="ghost"
      className={clsx(styles.button, className)}
    >
      <RiNotification2Line />
      {!!count && count > 0 && (
        <span className={styles.badge}>
          <span className="visually-hidden">{count}件の通知</span>
        </span>
      )}
    </IconButton>
  );
}
