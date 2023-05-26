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
import { TbX } from "react-icons/tb";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import Post from "@/src/app/post/components/Post";
import ImagePicker, {
  ImagePickerProps,
} from "@/src/app/post/components/composer/ImagePicker";
import { PostGraphemeCounter } from "@/src/app/post/components/composer/PostGraphemeCounter";
import EmbeddedRecord from "@/src/app/post/components/embed/EmbeddedRecord";
import { useLinkCardGenerator } from "@/src/app/post/hooks/useLinkCardGenerator";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import { createPostWithEmbed } from "@/src/app/post/lib/createPostWithEmbed";
import { RevalidateOnPost } from "@/src/app/post/lib/types";
import {
  SelectedImage,
  SelectedImageEdit,
} from "@/src/app/post/states/postComposerAtom";
import Avatar from "@/src/app/user/components/Avatar";
import { isPostValid } from "@/src/lib/atp";
import { isModKey } from "@/src/lib/keybindings";
import { SiteMetadata } from "@/src/lib/siteMetadata";

import styles from "./PostComposerMain.module.scss";

type PostMutateParams = {
  text: string;
  images: SelectedImage[];
  imageEdits: SelectedImageEdit[];
  myProfile: AppBskyActorDefs.ProfileViewDetailed;
  replyTarget?: AppBskyFeedDefs.FeedViewPost;
  quoteTarget?: AppBskyFeedDefs.PostView;
  siteMetadata?: SiteMetadata;
};

export type PostComposerProps = {
  openImgEditor: (idx: number) => void;
  textareaRef: React.Ref<HTMLTextAreaElement>;
  revalidate?: RevalidateOnPost;
};

export default function PostComposerMain({
  openImgEditor,
  textareaRef,
  revalidate,
}: PostComposerProps) {
  const { t } = useTranslation();
  const { data: account } = useAccountQuery();
  const formRef = React.useRef<HTMLDivElement>(null);

  const {
    replyTarget,
    quoteTarget,
    images,
    imageEdits,
    set: setComposer,
  } = usePostComposer();
  const setOpen = (val: boolean) =>
    void setComposer((curr) => ({ ...curr, open: val }));
  const setImages = (images: SelectedImage[]) => {
    setComposer((curr) => ({
      ...curr,
      images,
    }));
  };
  const handleRemoveImage = (idx: number) => {
    setComposer((draft) => {
      draft.images.splice(idx, 1);
      draft.imageEdits.splice(idx, 1);
    });
  };

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

  const [imagePreviewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null);
  const exceedingId = React.useId();

  const { mutate, isLoading } = useMutation({
    async mutationFn(params: PostMutateParams) {
      await createPostWithEmbed({
        ...params,
        external: params.siteMetadata,
      });
    },
    onSuccess() {
      setText("");
      setComposer((curr) => ({
        ...curr,
        quoteTarget: undefined,
        replyTarget: undefined,
        images: [],
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
      imageEdits: imageEdits,
      myProfile: account.profile,
      replyTarget,
      quoteTarget,
      siteMetadata: linkCard.siteMetadata,
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

  React.useEffect(() => {
    let timeout: number | undefined = undefined;
    if (formRef.current && replyTarget) {
      timeout = window.setTimeout(() => {
        // Doesn't work properly on iOS.
        // - `window.scrollTo()` does work but sometimes scroll the document root.
        // - passing a scroll parent doesn't work
        formRef.current!.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
    }
    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [replyTarget]);

  return (
    <div className={styles.container} id="container">
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
      <div className={styles.form} ref={formRef}>
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
      <hr />
      <div className={styles.action}>
        <div>
          <ImagePicker
            images={images}
            edits={imageEdits}
            onChange={setImages}
            onRemove={handleRemoveImage}
            onClickPreview={(idx) => openImgEditor(idx)}
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
  );
}
