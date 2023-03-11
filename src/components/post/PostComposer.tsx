import { AppBskyActorProfile, AppBskyFeedFeedViewPost } from "@atproto/api";
import { Button } from "@camome/core/Button";
import { Spinner } from "@camome/core/Spinner";
import { Textarea } from "@camome/core/Textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import ImageBlobReduce from "image-blob-reduce";
import { find } from "linkifyjs";
import React from "react";
import { TbPencilPlus } from "react-icons/tb";

import Avatar from "@/src/components/Avatar";
import Dialog from "@/src/components/Dialog";
import ImageUploader, {
  SelectedImage,
} from "@/src/components/post/ImageUploader";
import Post from "@/src/components/post/Post";
import { atp, bsky } from "@/src/lib/atp/atp";
import { isModKey } from "@/src/lib/keybindings";
import { isIPhone } from "@/src/lib/platform";
import { queryKeys } from "@/src/lib/queries/queriesKeys";

import styles from "./PostComposer.module.scss";

const imgReduce = ImageBlobReduce({});

export type PostComposerProps = {
  myProfile: AppBskyActorProfile.View;
  open: boolean;
  setOpen: (val: boolean) => void;
  onClickCompose: () => void;
  replyTarget?: AppBskyFeedFeedViewPost.Main;
  showButton?: boolean;
};

const uploadImages = async (images: SelectedImage[]) => {
  const cids: string[] = [];
  for (const img of images) {
    if (!img.file) return [];
    const imgBlob = await imgReduce.toBlob(img.file, {
      max: 1000,
    });
    const resp = await atp.api.com.atproto.blob.upload(
      new Uint8Array(await imgBlob.arrayBuffer()),
      {
        encoding: "image/jpeg",
      }
    );
    if (!resp.success) throw new Error("Failed to upload image");
    cids.push(resp.data.cid);
  }
  return cids;
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
      const imgCids = await uploadImages(images);

      const reply = (() => {
        if (!replyTarget) return undefined;
        const parent = { cid: replyTarget.post.cid, uri: replyTarget.post.uri };
        const root = replyTarget.reply?.root ? replyTarget.reply.root : parent;
        return {
          handle: replyTarget.post.author.handle,
          parent,
          root,
        };
      })();
      // TODO: Support mention
      // `linkify-plugin-mention` doesn't support usernames that include dots
      // https://github.com/Hypercontext/linkifyjs/issues/418#issuecomment-1370140269
      const urls = find(text, "url");
      await bsky.feed.post.create(
        { did: myProfile.did },
        {
          text,
          entities: urls.map((url) => ({
            type: "link",
            index: {
              start: url.start,
              end: url.end,
            },
            value: url.href,
          })),
          createdAt: new Date().toISOString(),
          reply,
          embed: {
            $type: "app.bsky.embed.images",
            images: imgCids.map((cid) => ({
              alt: "",
              image: {
                cid,
                mimeType: "image/jpeg",
              },
            })),
          },
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
              <ImageUploader
                images={images}
                onChange={setImages}
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
