import clsx from "clsx";
import Linkify from "linkify-react";

import styles from "./Prose.module.scss";

type Props = { children?: string; className?: string };

export default function Prose({ children, className }: Props) {
  return (
    <Linkify
      as="p"
      // Why?
      // @ts-ignore
      className={clsx(styles.container, className)}
      options={{
        target: "_blank",
        rel: "noopener noreferrer",
        truncate: 32,
        format: (value, type) => {
          // remove scheme
          if (type === "url") {
            return value.replace(/^.*:\/\//, "");
          }
          return value;
        },
        attributes: {
          onClick: (e: MouseEvent) => e.stopPropagation(),
        },
      }}
    >
      {children}
    </Linkify>
  );
}
