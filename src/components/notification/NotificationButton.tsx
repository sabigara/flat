import { IconButton } from "@camome/core/IconButton";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TbBell } from "react-icons/tb";
import { Link } from "react-router-dom";

import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries";

import styles from "./NotificationButton.module.scss";

export default function NotificationButton() {
  const { data: count } = useQuery({
    queryKey: queryKeys.notifications.count.$,
    async queryFn() {
      const resp = await bsky.notification.getCount();
      return resp.data.count;
    },
    refetchInterval: 60 * 3 * 1000,
  });

  return (
    <IconButton
      component={Link}
      to="/notifications"
      aria-label="通知を表示"
      size="sm"
      colorScheme="neutral"
      variant="ghost"
      className={styles.button}
    >
      <TbBell />
      <span className={styles.badge}>
        <span className="visually-hidden">{count}件の通知</span>
      </span>
    </IconButton>
  );
}
