import React from "react";

import { PostComposerButton } from "@/src/app/post/components/composer/PostComposerButton";
import { PostComposerImgEditor } from "@/src/app/post/components/composer/PostComposerImgEditor";
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
  const { open: outerOpen, set: setComposer, images } = usePostComposer();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const outerPanelRef = React.useRef<HTMLDivElement>(null);

  const [selectedImgIdx, setSelectedImgIdx] = React.useState<number>();
  const selectedImg =
    selectedImgIdx !== undefined ? images[selectedImgIdx] : undefined;
  const innerOpen = selectedImgIdx !== undefined;

  const handleOuterClose = () => {
    setComposer((draft) => void (draft.open = false));
  };

  const handleChangeAlt = (alt: string) => {
    if (selectedImgIdx === undefined) return;
    setComposer((draft) => {
      const target = draft.images[selectedImgIdx];
      if (!target) return;
      target.alt = alt;
    });
  };

  const handleInnerOpen = (idx: number) => {
    setSelectedImgIdx(idx);
    if (outerPanelRef.current) {
      outerPanelRef.current.style.opacity = "0";
    }
  };

  const handleInnerClose = () => {
    setSelectedImgIdx(undefined);
    if (outerPanelRef.current) {
      outerPanelRef.current.style.opacity = "1";
    }
  };

  return (
    <>
      {showButton && <PostComposerButton />}
      <Dialog
        open={outerOpen}
        onClose={handleOuterClose}
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
        showBackdrop
        refs={{ panel: outerPanelRef }}
        className={styles.dialog}
      >
        <PostComposerMain
          openImgEditor={handleInnerOpen}
          textareaRef={textareaRef}
          revalidate={revalidate}
        />

        <Dialog
          open={innerOpen}
          onClose={handleInnerClose}
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
          {selectedImg && (
            <PostComposerImgEditor
              image={selectedImg}
              onChangeAltSubmit={handleChangeAlt}
              defaultAlt={selectedImg.alt ?? ""}
              onClose={handleInnerClose}
            />
          )}
        </Dialog>
      </Dialog>
    </>
  );
}
