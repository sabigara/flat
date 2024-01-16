import { Tooltip } from "@/src/components/Tooltip";

import styles from "./Keybinding.module.scss";

type Props = {
  label?: string;
  kbd: string;
  side: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  delay?: number;
  children: React.ReactNode;
};

export function Keybinding({ label, kbd, ...props }: Props) {
  const title = (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <kbd className={styles.kbd}>{kbd}</kbd>
    </div>
  );
  return <Tooltip title={title} styled={!!label} {...props} />;
}
