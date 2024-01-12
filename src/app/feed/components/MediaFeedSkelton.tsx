import styles from "./MediaFeedSkelton.module.scss";

type Props = {
  count: number;
};

export function MediaFeedSkelton({ count = 12 }: Props) {
  return (
    <div className={styles.container}>
      {[...Array(count).keys()].map((k) => (
        <div className={styles.item} key={k} />
      ))}
    </div>
  );
}
