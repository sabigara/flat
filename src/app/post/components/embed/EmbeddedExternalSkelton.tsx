import clsx from "clsx";

import styles from "./EmbeddedExternalSkelton.module.scss";

type Props = {
  className?: string;
};

export function EmbeddedExternalSkelton({ className }: Props) {
  return <div className={clsx(styles.container, className)} />;
}
