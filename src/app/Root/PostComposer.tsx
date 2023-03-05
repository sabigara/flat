import Dialog from "@/src/components/Dialog";
import { bsky } from "@/src/lib/atp";
import { AppBskyActorProfile } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TbPencilPlus } from "react-icons/tb";
import React from "react";

import styles from "./PostComposer.module.scss";
import { isModKey, modKeyLabel } from "@/src/lib/keybindings";

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
        queryClient.invalidateQueries(["home-timeline"]);
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
            <kbd className={styles.kbd}>{modKeyLabel}+Enterで投稿</kbd>
            <Textarea
              label={<span className="visually-hidden">投稿内容</span>}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              fill
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className={styles.action}>
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
