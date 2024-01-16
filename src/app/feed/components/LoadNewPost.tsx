import { Button } from "@camome/core/Button";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { TbArrowUp } from "react-icons/tb";

import { reloadFeedForNewPosts } from "@/src/app/feed/lib/reloadFeedForNewPosts";
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

  return (
    <Button
      size="sm"
      onClick={handleClick}
      className={styles.newPostsBtn}
      startDecorator={<TbArrowUp />}
      {...isButtonLoading(isLoading)}
    >
      {t("feed.load-new-posts")}
    </Button>
  );
}
