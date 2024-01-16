import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbPencilPlus } from "react-icons/tb";

import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { useMobileSize } from "@/src/app/root/hooks/useMobileSize";

import styles from "./PostComposerButton.module.scss";

export const PostComposerButton = React.forwardRef<HTMLButtonElement>(
  (props, ref) => {
    const { t } = useTranslation();
    const { handleClickCompose } = usePostComposer();
    const isMobileSize = useMobileSize();

    return isMobileSize ? (
      <IconButton
        {...props}
        aria-label={t("post.composer.compose")}
        onClick={handleClickCompose}
        className={clsx(styles.container, styles["container--mobile"])}
        ref={ref}
      >
        <TbPencilPlus />
      </IconButton>
    ) : (
      <Button
        {...props}
        startDecorator={<TbPencilPlus />}
        size="lg"
        onClick={handleClickCompose}
        className={styles.container}
        ref={ref}
      >
        {t("post.composer.compose")}
      </Button>
    );
  },
);

PostComposerButton.displayName = "PostComposerButton";
