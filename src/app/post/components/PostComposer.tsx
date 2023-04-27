import { AppBskyActorDefs, AppBskyFeedDefs, RichText } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { IconButton } from "@camome/core/IconButton";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TbPencilPlus, TbX } from "react-icons/tb";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import ImagePicker, {
  ImagePickerProps,
  SelectedImage,
} from "@/src/app/post/components/ImagePicker";
import Post from "@/src/app/post/components/Post";
import { PostGraphemeCounter } from "@/src/app/post/components/PostGraphemeCounter";
import EmbeddedRecord from "@/src/app/post/components/embed/EmbeddedRecord";
import { useLinkCardGenerator } from "@/src/app/post/hooks/useLinkCardGenerator";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { createPostWithEmbed } from "@/src/app/post/lib/createPostWithEmbed";
import { RevalidateOnPost } from "@/src/app/post/lib/types";
import Avatar from "@/src/app/user/components/Avatar";
import Dialog from "@/src/components/Dialog";
import { atp, isPostValid } from "@/src/lib/atp";
import { isModKey } from "@/src/lib/keybindings";
import { SiteMetadata } from "@/src/lib/siteMetadata";

import styles from "./PostComposer.module.scss";

type PostMutateParams = {
  text: string;
  images: SelectedImage[];
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
  siteMetaData?: SiteMetadata;
};

export type PostComposerProps = {
  showButton?: boolean;
  revalidate?: RevalidateOnPost;
};

export default function PostComposer({
  showButton = true,
  revalidate,
}: PostComposerProps) {
  const { t } = useTranslation();
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
  const rt = new RichText({ text });

  const linkCard = useLinkCardGenerator({
    rt,
    onSuccess: (_, uri) => {
      setText((curr) => curr.replaceAll(uri, ""));
    },
    classNames: {
      data: styles.linkCardPreview,
      skelton: styles.linkCardPreview,
      error: styles.linkCardError,
      generator: styles.linkCardGenerator,
    },
  });

  const [images, setImages] = React.useState<SelectedImage[]>([]);
  const [imagePreviewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null);
  const exceedingId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate, isLoading } = useMutation({
    async mutationFn(params: PostMutateParams) {
      await createPostWithEmbed({
        ...params,
        images: params.images
          .map(({ file }) => file)
          .filter((file) => !!file) as File[],
        external: params.siteMetaData,
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
      revalidate?.({
        replyTarget,
      });
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
      siteMetaData: linkCard.siteMetadata,
    });
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (!(isModKey(e.nativeEvent) && e.key === "Enter")) return;
    if (!isPostValid(rt, images.length, !!linkCard.siteMetadata) || isLoading)
      return;
    handleClickSubmit();
  };

  const handleImagePickerError: ImagePickerProps["onError"] = (errors) => {
    if (!errors) return;
    // TODO: simply the code
    Object.keys(errors).forEach((err) => {
      switch (err as keyof typeof errors) {
        case "maxNumber":
          toast.error(t("post.composer.errors.img-max-number"));
          break;
        case "acceptType":
          toast.error(t("post.composer.errors.img-accept-type"));
          break;
        case "maxFileSize":
          toast.error(t("post.composer.errors.img-max-file-size"));
          break;
        default:
          toast.error(t("post.composer.errors.img-general"));
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
          startDecorator={<TbPencilPlus />}
          size="lg"
          onClick={handleClickCompose}
          className={styles.composeBtn}
        >
          {t("post.composer.compose")}
        </Button>
      )}
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
        <div className={styles.container}>
          <div>
            <IconButton
              aria-label={t("close")}
              size="sm"
              variant="ghost"
              colorScheme="neutral"
              onClick={() => void setOpen(false)}
              className={styles.closeBtn}
            >
              <TbX />
            </IconButton>
          </div>
          {replyTarget && (
            <>
              <Post
                data={replyTarget}
                isLink={false}
                isEmbedLink={false}
                contentOnly
                foldable={false}
                className={styles.post}
              />
              <hr />
            </>
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
                ? `${t("post.composer.reply-to")}: @${
                    replyTarget.post.author.handle
                  }`
                : t("post.composer.content")}
            </label>
            <Textarea
              id="post"
              value={text}
              placeholder={
                replyTarget
                  ? t("post.composer.textarea-placeholder-reply")
                  : t("post.composer.textarea-placeholder")
              }
              onChange={(e) => setText(e.target.value)}
              rows={6}
              fill
              onKeyDown={handleKeyDown}
              aria-describedby={exceedingId}
              ref={textareaRef}
            />
          </div>
          {quoteTarget && (
            <div className={styles.quoteTarget}>
              <EmbeddedRecord
                record={{
                  ...quoteTarget,
                  value: quoteTarget.record,
                }}
                isLink={false}
              />
            </div>
          )}
          {images.length === 0 && (
            <>
              {linkCard.preview}
              {linkCard.generator}
            </>
          )}
          {images.length > 0 && (
            <div
              ref={setPreviewContainer}
              className={styles.imagePreviewContainer}
            />
          )}
          <hr />
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
              <PostGraphemeCounter
                length={rt.graphemeLength}
                exceedingId={exceedingId}
              />
              <Button
                onClick={handleClickSubmit}
                disabled={
                  !isPostValid(rt, images.length, !!linkCard.siteMetadata) ||
                  isLoading
                }
                size="sm"
                startDecorator={isLoading ? <Spinner size="sm" /> : undefined}
              >
                {t("post.composer.submit")}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
