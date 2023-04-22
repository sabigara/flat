import { PostSkelton } from "@/src/app/post/components/PostSkelton";

import styles from "./TimelineSkelton.module.scss";

type Props = {
  count: number;
};

export function TimelineSkelton({ count = 10 }: Props) {
  return (
    <div>
      {[...Array(count).keys()].map((k) => (
        <PostSkelton key={k} className={styles.post} />
      ))}
    </div>
  );
}
