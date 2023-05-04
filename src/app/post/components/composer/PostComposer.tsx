import React from "react";

import { PostComposerButton } from "@/src/app/post/components/composer/PostComposerButton";
import PostComposerMain from "@/src/app/post/components/composer/PostComposerMain";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { RevalidateOnPost } from "@/src/app/post/lib/types";
import Dialog from "@/src/components/Dialog";

import styles from "./PostComposer.module.scss";

export type PostComposerProps = {
  showButton?: boolean;
  revalidate?: RevalidateOnPost;
};

export default function PostComposer({
  showButton = true,
  revalidate,
}: PostComposerProps) {
  const { open, set: setComposer } = usePostComposer();
  const setOpen = (val: boolean) =>
    void setComposer((curr) => ({ ...curr, open: val }));
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <>
      {showButton && <PostComposerButton />}
      <Dialog
        open={open}
        setOpen={setOpen}
        initialFocus={textareaRef}
        transitions={{
          panel: {
            enter: styles.panelEnter,
            enterFrom: styles.panelEnterFrom,
            enterTo: styles.panelEnterTo,
            leave: styles.panelLeave,
            leaveFrom: styles.panelLeaveFrom,
            leaveTo: styles.panelLeaveTo,
          },
        }}
        className={styles.dialog}
      >
        <PostComposerMain revalidate={revalidate} textareaRef={textareaRef} />
      </Dialog>
    </>
  );
}
