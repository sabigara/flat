import { AtUri } from "@atproto/uri";

import { usePostSingleQuery } from "@/src/lib/queries/usePostSingleQuery";

import styles from "./NotificationSubject.module.scss";

type Props = {
  reasonSubject: string;
};

export default function NotificationSubject({ reasonSubject }: Props) {
  const { host: user, rkey } = new AtUri(reasonSubject);
  const { data } = usePostSingleQuery({ user, rkey });
  if (!data) return null;
  return (
    <article>
      <div className={styles.body}>{data.text}</div>
    </article>
  );
}
