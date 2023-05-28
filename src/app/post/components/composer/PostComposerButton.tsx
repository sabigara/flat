import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { TbPencilPlus } from "react-icons/tb";

import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { useMobileSize } from "@/src/app/root/hooks/useMobileSize";

import styles from "./PostComposerButton.module.scss";

export function PostComposerButton() {
  const { t } = useTranslation();
  const { handleClickCompose } = usePostComposer();
  const isMobileSize = useMobileSize();

  return isMobileSize ? (
    <IconButton
      aria-label={t("post.composer.compose")}
      onClick={handleClickCompose}
      className={clsx(styles.container, styles["container--mobile"])}
    >
      <TbPencilPlus />
    </IconButton>
  ) : (
    <Button
      startDecorator={<TbPencilPlus />}
      size="lg"
      onClick={handleClickCompose}
      className={styles.container}
    >
      {t("post.composer.compose")}
    </Button>
  );
}
