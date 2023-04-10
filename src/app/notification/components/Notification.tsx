import { AppBskyNotificationListNotifications } from "@atproto/api";
import clsx from "clsx";
import { FaRetweet, FaUserCircle } from "react-icons/fa";
import { TbStarFilled, TbQuote } from "react-icons/tb";
import { Link } from "react-router-dom";

import NotificationPost from "@/src/app/notification/components/NotificationPost";
import Avatar from "@/src/app/user/components/Avatar";

import styles from "./Notification.module.scss";

type Props = {
  notification: AppBskyNotificationListNotifications.Notification;
};

// TODO: support tap to navigate to subject
export default function Notification({ notification }: Props) {
  const reason = notification.reason;
  const shouldFetchPost =
    reason === "reply" || reason === "repost" || reason === "like";
  const col2 = reason === "follow" || reason === "repost" || reason === "like";

  return (
    <div
      className={clsx(styles.container, {
        [styles.col2]: col2,
      })}
    >
      {col2 && (
        <div className={styles.startSection}>
          {reasonToIcon[notification.reason]}
        </div>
      )}
      <div className={styles.endSection}>
        {col2 && (
          <>
            <div>
              <Avatar
                profile={notification.author}
                isLink
                className={styles.avatar}
              />
            </div>
            <div>
              <Link
                to={`/${notification.author.handle}`}
                className={styles.displayName}
              >
                {notification.author.displayName ?? notification.author.handle}
              </Link>{" "}
              <span className={styles.reason}>
                {reasonToLabel[notification.reason]}
              </span>
            </div>
          </>
        )}
        {shouldFetchPost && notification.reasonSubject && (
          <NotificationPost
            uri={notification.reasonSubject}
            reason={notification.reason}
            isSubject
          />
        )}
        {(reason === "mention" || reason === "reply" || reason === "quote") && (
          <NotificationPost
            uri={notification.uri}
            reason={notification.reason}
            isSubject={false}
          />
        )}
      </div>
    </div>
  );
}

const reasonToIcon: Record<
  AppBskyNotificationListNotifications.Notification["reason"],
  React.ReactNode
> = {
  follow: <FaUserCircle className={styles.followIcon} />,
  invite: null,
  mention: null,
  reply: null,
  repost: <FaRetweet className={styles.repostIcon} />,
  like: <TbStarFilled className={styles.upvoteIcon} />,
  quote: <TbQuote />, // TODO: color
};

// TODO: support i18n
const reasonToLabel: Record<
  AppBskyNotificationListNotifications.Notification["reason"],
  string
> = {
  follow: `さんにフォローされました`,
  invite: ``,
  mention: `さんからのメンション`,
  reply: `さんから返信がありました`,
  repost: `さんにリポストされました`,
  like: `さんにいいねされました`,
  quote: `さんに引用されました`,
};
