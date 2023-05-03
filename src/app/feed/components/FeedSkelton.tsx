import { PostSkelton } from "@/src/app/post/components/PostSkelton";

import styles from "./FeedSkelton.module.scss";

type Props = {
  count: number;
};

export function FeedSkelton({ count = 10 }: Props) {
  return (
    <div>
      {[...Array(count).keys()].map((k) => (
        <PostSkelton key={k} className={styles.post} />
      ))}
    </div>
  );
}
