import { AppBskyFeedFeedViewPost, AppBskyNotificationList } from "@atproto/api";
import clsx from "clsx";
import { FaRetweet, FaUserCircle } from "react-icons/fa";
import { TbStarFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

import NotificationPost from "@/src/app/notification/components/NotificationSubject";
import Avatar from "@/src/app/user/components/Avatar";

import styles from "./Notification.module.scss";

type Props = {
  notification: AppBskyNotificationList.Notification;
  onClickReply?: (feedItem: AppBskyFeedFeedViewPost.Main) => void;
};

// TODO: support tap to navigate to subject
export default function Notification({ notification, onClickReply }: Props) {
  const reason = notification.reason;
  const shouldFetchPost =
    reason === "reply" || reason === "repost" || reason === "vote";

  const col2 = reason === "follow" || reason === "repost" || reason === "vote";

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
            onClickReply={onClickReply}
          />
        )}
        {(reason === "mention" || reason === "reply") && (
          <NotificationPost
            uri={notification.uri}
            reason={notification.reason}
            isSubject={false}
            onClickReply={onClickReply}
          />
        )}
      </div>
    </div>
  );
}

const reasonToIcon: Record<
  AppBskyNotificationList.Notification["reason"],
  React.ReactNode
> = {
  follow: <FaUserCircle className={styles.followIcon} />,
  invite: null,
  mention: null,
  reply: null,
  repost: <FaRetweet className={styles.repostIcon} />,
  vote: <TbStarFilled className={styles.upvoteIcon} />,
};

// TODO: support i18n
const reasonToLabel: Record<
  AppBskyNotificationList.Notification["reason"],
  string
> = {
  follow: `さんにフォローされました`,
  invite: ``,
  mention: `さんからのメンション`,
  reply: `さんから返信がありました`,
  repost: `さんにリポストされました`,
  vote: `さんにいいねされました`,
};
