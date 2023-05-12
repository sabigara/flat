import clsx from "clsx";
import { useNavigation, useRevalidator } from "react-router-dom";

import styles from "./PageTransitionProgress.module.scss";

type Props = {
  className?: string;
};

export function PageTransitionProgress({ className }: Props) {
  const { state: navState } = useNavigation();
  const { state: revalidateState } = useRevalidator();
  const progressBusy = navState === "loading" || revalidateState === "loading";

  return (
    <div className={clsx(styles.container, className)}>
      {progressBusy && (
        <div role="status">
          {/* TODO: i18n */}
          <span className="visually-hidden">
            次のページのデータを取得中・・・
          </span>
        </div>
      )}
    </div>
  );
}
