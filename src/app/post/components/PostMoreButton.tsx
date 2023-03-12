import { AppBskyActorProfile, AppBskyFeedPost } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";

import { bsky } from "@/src/lib/atp";

import styles from "./PostMoreButton.module.scss";

type Props = {
  myProfile?: AppBskyActorProfile.View;
  post: AppBskyFeedPost.View;
  button: React.ReactNode;
  revalidate?: () => void;
};

export default function PostMoreButton({
  myProfile,
  post,
  button,
  revalidate,
}: Props) {
  const toastRef = React.useRef<string>();
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });

  const { mutate } = useMutation({
    async mutationFn({ post }: { post: AppBskyFeedPost.View }) {
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

  const actions: { label: string; onClick: () => void }[] = [];

  if (myProfile && post.author.did === myProfile.did) {
    actions.push({
      label: "削除",
      onClick: () => mutate({ post }),
    });
  }

  if (actions.length === 0) return null;

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
        {actions.map(({ label, onClick }) => (
          <Menu.Item key={label} as={React.Fragment}>
            {({ active, disabled }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className={clsx(
                  menuClassNames.item,
                  styles.link,
                  active && menuClassNames.itemActive,
                  disabled && menuClassNames.itemDisabled
                )}
              >
                {label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
