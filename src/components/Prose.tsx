import clsx from "clsx";

import styles from "./Prose.module.scss";

type Props = { children?: React.ReactNode; className?: string };

export default function Prose({ children, className }: Props) {
  return <div className={clsx(styles.container, className)}>{children}</div>;
}
