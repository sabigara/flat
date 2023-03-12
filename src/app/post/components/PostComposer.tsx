import { AppBskyActorProfile } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { TbPencilPlus } from "react-icons/tb";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import { compressImage } from "@/src/app/content/image/lib/compressImage";
import { uploadImage } from "@/src/app/content/image/lib/uploadImage";
import ImagePicker, {
  ImagePickerProps,
  SelectedImage,
} from "@/src/app/post/components/ImagePicker";
import Post from "@/src/app/post/components/Post";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { embedImages } from "@/src/app/post/lib/embedImages";
import { postTextToEntities } from "@/src/app/post/lib/postTextToEntities";
import { postToReply } from "@/src/app/post/lib/postToReply";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Avatar from "@/src/app/user/components/Avatar";
import Dialog from "@/src/components/Dialog";
import { bsky } from "@/src/lib/atp";
import { isModKey } from "@/src/lib/keybindings";
import { isIPhone } from "@/src/lib/platform";

import styles from "./PostComposer.module.scss";

export type PostComposerProps = {
  showButton?: boolean;
};

const uploadImageBulk = async (images: SelectedImage[]) => {
  const results: { cid: string; mimetype: string }[] = [];
  for (const img of images) {
    if (!img.file) continue;
    const res = await uploadImage(await compressImage(img.file));
    results.push(res);
  }
  return results;
};

export default function PostComposer({ showButton }: PostComposerProps) {
  const { data: account } = useAccountQuery();
  const { open, replyTarget, handleClickCompose, set } = usePostComposer();
  const setOpen = (val: boolean) =>
    void set((curr) => ({ ...curr, open: val }));
  const queryClient = useQueryClient();
  const [text, setText] = React.useState("");
  const [images, setImages] = React.useState<SelectedImage[]>([]);
  // TODO: length
  const isTextValid = !!text.trim();
  const [imagePreviewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null);

  const { mutate, isLoading } = useMutation(
    async ({
      images,
      myProfile,
    }: {
      images: SelectedImage[];
      myProfile: AppBskyActorProfile.View;
    }) => {
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
      onSuccess(_, { myProfile }) {
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
    if (!account || !isTextValid || isLoading) return;
    mutate({ images, myProfile: account.profile });
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
          onClick={handleClickCompose}
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
            <Avatar profile={account?.profile} className={styles.avatar} />
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
                onClick={() =>
                  void (
                    account && mutate({ images, myProfile: account?.profile })
                  )
                }
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
