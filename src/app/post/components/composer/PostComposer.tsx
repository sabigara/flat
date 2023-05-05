import React from "react";

import { PostComposerButton } from "@/src/app/post/components/composer/PostComposerButton";
import { PostComposerImgEditor } from "@/src/app/post/components/composer/PostComposerImgEditor";
import PostComposerMain from "@/src/app/post/components/composer/PostComposerMain";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { RevalidateOnPost } from "@/src/app/post/lib/types";
import { SelectedImageEdit } from "@/src/app/post/states/postComposerAtom";
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
  const {
    open: outerOpen,
    set: setComposer,
    images,
    imageEdits,
  } = usePostComposer();

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const outerPanelRef = React.useRef<HTMLDivElement>(null);

  const [selectedImgIdx, setSelectedImgIdx] = React.useState<number>(-1);
  const selectedImg = images[selectedImgIdx];
  const selectedImgEdit = imageEdits[selectedImgIdx];
  const innerOpen = selectedImgIdx >= 0;

  const handleOuterClose = () => {
    setComposer((draft) => void (draft.open = false));
  };

  const handleSubmit = (val: SelectedImageEdit) => {
    if (selectedImgIdx === undefined) return;
    setComposer((draft) => {
      draft.imageEdits[selectedImgIdx] = val;
    });
  };

  const handleInnerOpen = (idx: number) => {
    setSelectedImgIdx(idx);
    if (outerPanelRef.current) {
      outerPanelRef.current.style.opacity = "0";
    }
  };

  const handleInnerClose = () => {
    setSelectedImgIdx(-1);
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
              onSubmit={handleSubmit}
              defaultValues={selectedImgEdit}
              onClose={handleInnerClose}
            />
          )}
        </Dialog>
      </Dialog>
    </>
  );
}
