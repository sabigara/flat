import clsx from "clsx";

import styles from "./PostGraphemeCounter.module.scss";

type Props = {
  length: number;
  exceedingId?: string;
};

const MAX = 300 as const;

export function PostGraphemeCounter({ length, exceedingId }: Props) {
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
  const exceeding = MAX - length;
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
      {length >= MAX && (
        <div id={exceedingId} className={styles.exceeding}>
          <span aria-hidden>{exceeding}</span>
          <span className="visually-hidden">
            {-exceeding}文字超過しています
          </span>
        </div>
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
