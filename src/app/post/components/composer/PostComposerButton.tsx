import { Button } from "@camome/core/Button";
import { useTranslation } from "react-i18next";
import { TbPencilPlus } from "react-icons/tb";

import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";

import styles from "./PostComposerButton.module.scss";

export function PostComposerButton() {
  const { t } = useTranslation();
  const { handleClickCompose } = usePostComposer();

  return (
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
