import { AppBskyActorProfile, AppBskyFeedFeedViewPost } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { TbPencilPlus } from "react-icons/tb";

import Avatar from "@/src/components/Avatar";
import Dialog from "@/src/components/Dialog";
import ImagePicker, {
  ImagePickerProps,
  SelectedImage,
} from "@/src/components/post/ImagePicker";
import Post from "@/src/components/post/Post";
import { bsky } from "@/src/lib/atp/atp";
import { uploadImage } from "@/src/lib/atp/blob";
import {
  embedImages,
  postTextToEntities,
  postToReply,
} from "@/src/lib/atp/feed";
import { isModKey } from "@/src/lib/keybindings";
import { isIPhone } from "@/src/lib/platform";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

import styles from "./PostComposer.module.scss";

export type PostComposerProps = {
  myProfile: AppBskyActorProfile.View;
  open: boolean;
  setOpen: (val: boolean) => void;
  onClickCompose: () => void;
  replyTarget?: AppBskyFeedFeedViewPost.Main;
  showButton?: boolean;
};

const uploadImageBulk = async (images: SelectedImage[]) => {
  const results: { cid: string; mimetype: string }[] = [];
  for (const img of images) {
    if (!img.file) continue;
    const res = await uploadImage(img.file);
    results.push(res);
  }
  return results;
};

export default function PostComposer({
  myProfile,
  open,
  setOpen,
  onClickCompose,
  replyTarget,
  showButton,
}: PostComposerProps) {
  const queryClient = useQueryClient();
  const [text, setText] = React.useState("");
  const [images, setImages] = React.useState<SelectedImage[]>([]);
  // TODO: length
  const isTextValid = !!text.trim();
  const [imagePreviewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null);

  const { mutate, isLoading } = useMutation(
    async ({ images }: { images: SelectedImage[] }) => {
      const imgResults = images.length
        ? await uploadImageBulk(images)
        : undefined;
      await bsky.feed.post.create(
        { did: myProfile.did },
        {
          text,
          entities: postTextToEntities(text),
          reply: replyTarget ? postToReply(replyTarget) : undefined,
          embed:
            imgResults && imgResults?.length
              ? embedImages(imgResults)
              : undefined,
          createdAt: new Date().toISOString(),
        }
      );
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(queryKeys.feed.home.$);
        queryClient.invalidateQueries(
          queryKeys.feed.author.$(myProfile.handle)
        );
        setText("");
        setImages([]);
        setOpen(false);
      },
    }
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (!(isModKey(e.nativeEvent) && e.key === "Enter")) return;
    if (!isTextValid || isLoading) return;
    mutate({ images });
  };

  const handleImagePickerError: ImagePickerProps["onError"] = (errors) => {
    if (!errors) return;
    // TODO: simply the code
    Object.keys(errors).forEach((err) => {
      switch (err as keyof typeof errors) {
        case "maxNumber":
          toast.error("4枚までアップロードできます");
          break;
        case "acceptType":
          toast.error("無効なファイル形式です");
          break;
        case "maxFileSize":
          toast.error("サイズは1MBまでアップロードできます");
          break;
        default:
          toast.error("無効な画像です");
          break;
      }
    });
  };

  return (
    <>
      {showButton && (
        <Button
          aria-label="投稿ツールを開く"
          startDecorator={<TbPencilPlus />}
          size="lg"
          onClick={onClickCompose}
          className={styles.composeBtn}
        >
          つぶやく
        </Button>
      )}
      <Dialog open={open} setOpen={setOpen} className={styles.dialog}>
        <div className={styles.container}>
          {replyTarget && (
            <Post data={replyTarget} contentOnly className={styles.post} />
          )}
          <div className={styles.form}>
            <Avatar profile={myProfile} className={styles.avatar} />
            {/* TODO: Textarea isn't passing id to textarea */}
            <label
              htmlFor="post"
              className={clsx(styles.label, {
                ["visually-hidden"]: !replyTarget,
              })}
            >
              {replyTarget
                ? `返信先: @${replyTarget.post.author.handle}`
                : "投稿内容"}
            </label>
            <Textarea
              id="post"
              value={text}
              placeholder={replyTarget ? "なんていう？" : "なにしてる？"}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              fill
              onKeyDown={handleKeyDown}
              // focusing on textarea breaks scroll position on iPhone🫵
              autoFocus={isIPhone ? false : true}
            />
          </div>
          <div
            ref={setPreviewContainer}
            className={styles.imagePreviewContainer}
          />
          <div className={styles.action}>
            <div>
              <ImagePicker
                images={images}
                onChange={setImages}
                onError={handleImagePickerError}
                max={4}
                previewContainer={imagePreviewContainer}
              />
            </div>
            <div className={styles.postBtnWrap}>
              <Button
                variant="soft"
                colorScheme="neutral"
                size="sm"
                onClick={() => setOpen(false)}
              >
                やめる
              </Button>
              <Button
                onClick={() => mutate({ images })}
                disabled={!isTextValid || isLoading}
                size="sm"
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
