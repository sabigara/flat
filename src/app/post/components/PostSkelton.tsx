import clsx from "clsx";

import styles from "./PostSkelton.module.scss";

type Props = {
  className?: string;
};

export function PostSkelton({ className }: Props) {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.avatar} />
        </div>
        <div className={styles.right}>
          <div className={styles.header}></div>
          <div className={styles.prose} />
        </div>
      </div>
    </div>
  );
}
