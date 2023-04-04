import { AppBskyActorDefs, AppBskyFeedDefs, RichText } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { TbPencilPlus } from "react-icons/tb";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import ImagePicker, {
  ImagePickerProps,
  SelectedImage,
} from "@/src/app/post/components/ImagePicker";
import Post from "@/src/app/post/components/Post";
import { PostGraphemeCounter } from "@/src/app/post/components/PostGraphemeCounter";
import EmbeddedRecord from "@/src/app/post/components/embed/EmbeddedRecord";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { createPostWithEmbed } from "@/src/app/post/lib/createPostWithEmbed";
import Avatar from "@/src/app/user/components/Avatar";
import Dialog from "@/src/components/Dialog";
import { atp, isPostValid } from "@/src/lib/atp";
import { isModKey } from "@/src/lib/keybindings";
import { isIPhone } from "@/src/lib/platform";

import styles from "./PostComposer.module.scss";

type PostMutateParams = {
  text: string;
  images: SelectedImage[];
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
};

export type PostComposerProps = {
  showButton?: boolean;
  revalidate?: () => void;
};

export default function PostComposer({
  showButton = true,
  revalidate,
}: PostComposerProps) {
  const { data: account } = useAccountQuery();
  const {
    open,
    replyTarget,
    quoteTarget,
    handleClickCompose,
    set: setComposer,
  } = usePostComposer();
  const setOpen = (val: boolean) =>
    void setComposer((curr) => ({ ...curr, open: val }));
  const [text, setText] = React.useState("");
  const [images, setImages] = React.useState<SelectedImage[]>([]);
  const rt = new RichText({ text });
  const [imagePreviewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null);
  const exceedingId = React.useId();

  const { mutate, isLoading } = useMutation({
    async mutationFn(params: PostMutateParams) {
      await createPostWithEmbed({
        ...params,
        images: params.images
          .map(({ file }) => file)
          .filter((file) => !!file) as File[],
        atp,
      });
    },
    onSuccess() {
      setText("");
      setImages([]);
      setComposer((curr) => ({
        ...curr,
        quoteTarget: undefined,
        replyTarget: undefined,
      }));
      setOpen(false);
      revalidate?.();
    },
  });

  const handleClickSubmit = () => {
    if (!account) return;
    mutate({
      text,
      images,
      myProfile: account.profile,
      replyTarget,
      quoteTarget,
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (!(isModKey(e.nativeEvent) && e.key === "Enter")) return;
    if (!isPostValid(rt, images.length) || isLoading) return;
    handleClickSubmit();
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

  // keep text as long as referencing to the same reply target or not a reply
  React.useEffect(() => {
    setText("");
  }, [replyTarget, quoteTarget]);

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
              // focusing on textarea breaks scroll position on iPhone 🫵
              autoFocus={isIPhone ? false : true}
              aria-describedby={exceedingId}
            />
          </div>
          {quoteTarget && (
            <div className={styles.quoteTarget}>
              <EmbeddedRecord
                record={{
                  ...quoteTarget,
                  value: quoteTarget.record,
                }}
              />
            </div>
          )}
          <div
            ref={setPreviewContainer}
            className={styles.imagePreviewContainer}
          />
          <div className={styles.action}>
            <div>
              {/* a post can have a embedded content */}
              {!quoteTarget && (
                <ImagePicker
                  images={images}
                  onChange={setImages}
                  onError={handleImagePickerError}
                  max={4}
                  previewContainer={imagePreviewContainer}
                />
              )}
            </div>
            <div className={styles.postBtnWrap}>
              <PostGraphemeCounter
                length={rt.graphemeLength}
                exceedingId={exceedingId}
              />
              <Button
                variant="soft"
                colorScheme="neutral"
                size="sm"
                onClick={() => setOpen(false)}
              >
                やめる
              </Button>
              <Button
                onClick={handleClickSubmit}
                disabled={!isPostValid(rt, images.length) || isLoading}
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
