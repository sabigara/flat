import { Button } from "@camome/core/Button";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { TbArrowUp } from "react-icons/tb";

import { reloadFeedForNewPosts } from "@/src/app/feed/lib/reloadFeedForNewPosts";
import { Keybinding } from "@/src/components/Keybinding";
import { isButtonLoading } from "@/src/components/isButtonLoading";

import styles from "./LoadNewPost.module.scss";

type Props = {
  queryKey: QueryKey;
  isLoading: boolean;
};

export default function LoadNewPost({ queryKey, isLoading }: Props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  const handleClick = () => {
    reloadFeedForNewPosts(queryClient, queryKey);
  };

  useHotkeys("r", handleClick);

  const loading = isButtonLoading(isLoading);

  return (
    <Keybinding kbd="R" side="bottom">
      <Button
        size="sm"
        onClick={handleClick}
        className={styles.newPostsBtn}
        startDecorator={
          <div className={styles.decor}>
            {loading.startDecorator || <TbArrowUp />}
          </div>
        }
        disabled={loading.disabled}
      >
        {t("feed.load-new-posts")}
      </Button>
    </Keybinding>
  );
}
