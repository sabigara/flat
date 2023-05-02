import { AppBskyNotificationListNotifications } from "@atproto/api";
import clsx from "clsx";
import { Trans } from "react-i18next";
import { FaRetweet, FaUserCircle } from "react-icons/fa";
import { TbStarFilled, TbQuote } from "react-icons/tb";
import { Link } from "react-router-dom";

import NotificationPost from "@/src/app/notification/components/NotificationPost";
import Avatar from "@/src/app/user/components/Avatar";
import { userToName } from "@/src/app/user/lib/userToName";

import styles from "./Notification.module.scss";

type Props = {
  notification: AppBskyNotificationListNotifications.Notification;
  className?: string;
};

export default function Notification({ notification, className }: Props) {
  const reason = notification.reason;
  if (!isKnownReason(reason)) return null;
  const shouldFetchPost =
    reason === "reply" || reason === "repost" || reason === "like";
  const col2 = reason === "follow" || reason === "repost" || reason === "like";

  return (
    <div
      className={clsx(styles.container, className, {
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
            <div className={styles.message}>
              <Trans
                ns="notification"
                i18nKey={reason}
                values={{ actor: userToName(notification.author) }}
                components={{
                  anchor: (
                    <Link
                      to={`/${notification.author.handle}`}
                      className={styles.displayName}
                    />
                  ),
                  reason: <span key="reason" className={styles.reason} />,
                }}
              />
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

type Reason = AppBskyNotificationListNotifications.Notification["reason"];

const reasonToIcon: Record<Reason, React.ReactNode> = {
  follow: <FaUserCircle className={styles.followIcon} />,
  invite: null,
  mention: null,
  reply: null,
  repost: <FaRetweet className={styles.repostIcon} />,
  like: <TbStarFilled className={styles.upvoteIcon} />,
  quote: <TbQuote />, // TODO: color
};

const knownReasons = [
  "follow",
  "invite",
  "mention",
  "reply",
  "repost",
  "like",
  "quote",
];

function isKnownReason(
  reason: Reason
  // eslint-disable-next-line @typescript-eslint/ban-types
): reason is Exclude<Reason, string & {}> {
  return knownReasons.includes(reason);
}
