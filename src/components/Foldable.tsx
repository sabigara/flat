import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";

import styles from "./Foldable.module.scss";

type Props = {
  lines?: number;
  enabled?: boolean;
  children: React.ReactNode;
};

export function Foldable({ lines = 5, enabled = true, children }: Props) {
  const { t } = useTranslation();
  const [folded, setFolded] = React.useState(enabled);
  const [outer, setOuter] = React.useState<HTMLDivElement | null>(null);
  const [inner, setInner] = React.useState<HTMLDivElement | null>(null);

  const { height: outerH } = outer?.getBoundingClientRect() ?? {
    height: 0,
  };
  const { height: innerH } = inner?.getBoundingClientRect() ?? {
    height: 0,
  };

  const overflowing = innerH > outerH;
  const shouldShowOverlay = overflowing && folded;

  const handleClickBtn: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    setFolded(false);
  };

  if (!enabled) return <>{children}</>;

  return (
    <div
      className={clsx(
        folded ? styles["container--folded"] : styles["container--revealed"],
      )}
      style={{ ["--lines"]: lines } as React.CSSProperties}
      ref={setOuter}
    >
      <div
        className={clsx({
          [styles.overlay]: shouldShowOverlay,
        })}
      >
        <div ref={setInner}>{children}</div>
      </div>
      {shouldShowOverlay && (
        <button onClick={handleClickBtn} className={styles.revealBtn}>
          <span className={styles.revealBtn__label}>{t("post.show-all")}</span>
        </button>
      )}
    </div>
  );
}
