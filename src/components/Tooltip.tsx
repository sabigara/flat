import * as TooltipBase from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

import styles from "./Tooltip.module.scss";

type Props = {
  title: ReactNode;
  children: ReactNode;
  side: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  delay?: number;
  styled?: boolean;
};

export function Tooltip({
  title,
  children,
  side = "bottom",
  sideOffset = 6,
  delay = 400,
  styled = true,
}: Props) {
  return (
    <TooltipBase.Root delayDuration={delay}>
      <TooltipBase.Trigger asChild>{children}</TooltipBase.Trigger>
      <TooltipBase.Portal>
        <TooltipBase.Content
          side={side}
          sideOffset={sideOffset}
          className={styles.content}
          data-styled={styled ? "" : undefined}
        >
          {title}
        </TooltipBase.Content>
      </TooltipBase.Portal>
    </TooltipBase.Root>
  );
}
