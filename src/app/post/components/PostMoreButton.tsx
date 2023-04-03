import { AppBskyActorProfile, AppBskyFeedDefs } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { TbTrash, TbQuote } from "react-icons/tb";

import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { bsky } from "@/src/lib/atp";

import styles from "./PostMoreButton.module.scss";

type Props = {
  myProfile?: AppBskyActorProfile.Record;
  post: AppBskyFeedDefs.PostView;
  button: React.ReactNode;
  revalidate?: () => void;
};

export default function PostMoreButton({
  myProfile,
  post,
  button,
  revalidate,
}: Props) {
  const { handleClickQuote } = usePostComposer();
  const toastRef = React.useRef<string>();
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });

  const { mutate: deleteMutation } = useMutation({
    async mutationFn({ post }: { post: AppBskyFeedDefs.PostView }) {
      const { host, rkey } = new AtUri(post.uri);
      await bsky.feed.post.delete({ did: host, rkey });
    },
    onMutate() {
      toastRef.current = toast.loading("投稿を削除しています");
    },
    onSuccess() {
      toast.success("削除が完了しました", {
        id: toastRef.current,
      });
      revalidate?.();
    },
    onSettled() {
      toastRef.current = undefined;
    },
  });

  const moreActions: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[] = [];

  moreActions.push({
    label: "投稿を引用",
    icon: <TbQuote />,
    onClick: () => handleClickQuote(post),
  });

  if (myProfile && post.author.did === myProfile.did) {
    moreActions.push({
      label: "投稿を削除",
      icon: <TbTrash />,
      onClick: () =>
        window.confirm("削除してよろしいですか？") && deleteMutation({ post }),
      danger: true,
    });
  }

  if (moreActions.length === 0) return null;

  return (
    <Menu as="div" className={styles.menu}>
      <Menu.Button as={React.Fragment} ref={reference}>
        {button}
      </Menu.Button>
      <Menu.Items
        className={clsx(menuClassNames.menu, styles.menu__items)}
        ref={floating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        {moreActions.map(({ label, icon, onClick, danger }) => (
          <Menu.Item key={label} as={React.Fragment}>
            {({ active, disabled }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className={clsx(
                  menuClassNames.item,
                  styles.menu__item,
                  active && menuClassNames.itemActive,
                  disabled && menuClassNames.itemDisabled,
                  danger && styles.danger
                )}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
