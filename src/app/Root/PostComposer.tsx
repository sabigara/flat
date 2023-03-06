import React from "react";
import Dialog from "@/src/components/Dialog";
import { bsky } from "@/src/lib/atp/atp";
import { AppBskyActorProfile } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbPencilPlus } from "react-icons/tb";
import { isModKey, modKeyLabel } from "@/src/lib/keybindings";
import { queryKeys } from "@/src/lib/queries";

import styles from "./PostComposer.module.scss";

type Props = {
  profile: AppBskyActorProfile.View;
};

export default function PostComposer({ profile }: Props) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [text, setText] = React.useState("");
  // TODO: length
  const isTextValid = !!text.trim();

  const { mutate, isLoading } = useMutation(
    async () => {
      await bsky.feed.post.create(
        { did: profile.did },
        {
          text,
          createdAt: new Date().toISOString(),
        }
      );
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(queryKeys.feed.home.$);
        queryClient.invalidateQueries(queryKeys.feed.author.$(profile.handle));
        setText("");
        setOpen(false);
      },
    }
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (!(isModKey(e.nativeEvent) && e.key === "Enter")) return;
    if (!isTextValid) return;
    mutate();
  };

  return (
    <>
      <Button
        aria-label="投稿ツールを開く"
        startDecorator={<TbPencilPlus />}
        size="lg"
        onClick={() => void setOpen(true)}
        className={styles.composeBtn}
      >
        つぶやく
      </Button>
      <Dialog
        open={open}
        setOpen={setOpen}
        title="いまなにしてる？"
        className={styles.dialog}
      >
        <div className={styles.container}>
          <div>
            <label>
              <div className="visually-hidden">投稿内容</div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                fill
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </label>
          </div>
          <div className={styles.action}>
            <p className={styles.keybinding}>
              <kbd>{modKeyLabel}+Enter</kbd>
              <span>で投稿</span>
            </p>
            <div className={styles.postBtnWrap}>
              <Button
                onClick={() => mutate()}
                disabled={!isTextValid || isLoading}
                size="md"
                startDecorator={isLoading ? <Spinner size="sm" /> : undefined}
              >
                つぶやく
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
