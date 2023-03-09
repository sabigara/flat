import {
  AppBskyNotificationList,
  AppBskyFeedPost,
  AppBskyFeedVote,
} from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import NotificationSubject from "@/src/components/notification/NotificationSubject";
import { bsky } from "@/src/lib/atp/atp";
import { queryKeys } from "@/src/lib/queries";

import styles from "./Notification.module.scss";

type Props = {
  notification: AppBskyNotificationList.Notification;
};

export default function Notification({ notification }: Props) {
  const shouldFetchPost =
    notification.reason === "reply" || notification.reason === "vote";
  console.log(notification);
  return (
    <div>
      <div>{notification.author.displayName}</div>
      <div>{notification.reason}</div>
      {/* TS is not clever enough */}
      {shouldFetchPost && notification.reasonSubject && (
        <NotificationSubject reasonSubject={notification.reasonSubject} />
      )}
    </div>
  );
}
