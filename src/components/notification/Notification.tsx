import { AppBskyFeedPost, AppBskyNotificationList } from "@atproto/api";
import { FaRetweet, FaUserCircle } from "react-icons/fa";
import { TbMessageCircle2Filled, TbStarFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

import Avatar from "@/src/components/Avatar";
import Prose from "@/src/components/Prose";
import NotificationSubject from "@/src/components/notification/NotificationSubject";

import styles from "./Notification.module.scss";

type Props = {
  notification: AppBskyNotificationList.Notification;
};

// TODO: support tap to navigate to subject
// TODO: replace mention with Post component
export default function Notification({ notification }: Props) {
  const shouldFetchPost =
    notification.reason === "reply" ||
    notification.reason === "repost" ||
    notification.reason === "vote";
  return (
    <div className={styles.container}>
      <div className={styles.startSection}>
        {reasonToIcon[notification.reason]}
      </div>
      <div className={styles.endSection}>
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
        {shouldFetchPost && notification.reasonSubject && (
          <NotificationSubject reasonSubject={notification.reasonSubject} />
        )}
        {notification.reason === "mention" &&
          AppBskyFeedPost.isRecord(notification.record) && (
            <article className={styles.mention}>
              <Prose>{notification.record.text}</Prose>
            </article>
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
  reply: <TbMessageCircle2Filled className={styles.replyIcon} />,
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
