import clsx from "clsx";

import styles from "./PostGraphemeCounter.module.scss";

type Props = {
  length: number;
};

const MAX = 300 as const;

export function PostGraphemeCounter({ length }: Props) {
  const percent = Math.min((length / MAX) * 100, 100);
  const status = (() => {
    if (percent < 80) {
      return "normal";
    } else if (percent < 100) {
      return "warn";
    } else {
      return "danger";
    }
  })();
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={MAX}
      aria-valuenow={length}
      className={clsx(styles.container, {
        [styles.warn]: status === "warn",
        [styles.danger]: status === "danger",
      })}
    >
      {/* TODO: should be tied to the textarea field for a11y. */}
      {length >= MAX && (
        <span className={styles.exceeding}>{MAX - length}</span>
      )}
      <svg viewBox="0 0 120 120" className={styles.svg}>
        <circle cx="60" cy="60" r="50" fill="none" className={styles.track} />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          pathLength="100"
          style={{ strokeDashoffset: 100 - percent }}
          className={styles.value}
        />
      </svg>
    </div>
  );
}
