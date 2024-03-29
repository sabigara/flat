import {
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TbTrash, TbQuote, TbClipboard, TbShare } from "react-icons/tb";

import { getBskyApi } from "@/src/app/account/states/atp";
import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import Menu from "@/src/components/Menu";
import { isMobile } from "@/src/lib/platform";

type Props = {
  myProfile?: AppBskyActorDefs.ProfileViewDetailed;
  post: AppBskyFeedDefs.PostView;
  button: React.ReactNode;
  revalidate?: () => void;
};

export default function PostMoreMenu({
  myProfile,
  post,
  button,
  revalidate,
}: Props) {
  const { t } = useTranslation();
  const { handleClickQuote } = usePostComposer();
  const toastRef = React.useRef<string>();

  const { mutate: deleteMutation } = useMutation({
    async mutationFn({ post }: { post: AppBskyFeedDefs.PostView }) {
      const { host, rkey } = new AtUri(post.uri);
      await getBskyApi().feed.post.delete({ repo: host, rkey });
    },
    onMutate() {
      toastRef.current = toast.loading(t("post.delete.loading"));
    },
    onSuccess() {
      toast.success(t("post.delete.success"), {
        id: toastRef.current,
      });
      revalidate?.();
    },
    onError() {
      toast.dismiss(toastRef.current);
      toast.error(t("post.delete.error"));
    },
    onSettled() {
      toastRef.current = undefined;
    },
  });

  const copyText = async (text: string, msg: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  const copyContent = () => {
    if (!AppBskyFeedPost.isRecord(post.record)) return;
    copyText(post.record.text, t("post.copy-content.success"));
  };

  const shareOrCopyUrl = async () => {
    if (!AppBskyFeedPost.isRecord(post.record)) return;
    const url = `https://bsky.app/profile/${post.author.handle}/post/${
      new AtUri(post.uri).rkey
    }`;
    if (isMobile()) {
      await navigator.share({
        url,
      });
    } else {
      copyText(url, t("post.share.success"));
    }
  };

  const moreActions: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[] = [];

  moreActions.push({
    label: t("post.quote.do"),
    icon: <TbQuote />,
    onClick: () => handleClickQuote(post),
  });

  moreActions.push({
    label: t("post.copy-content.label"),
    icon: <TbClipboard />,
    onClick: copyContent,
  });

  moreActions.push({
    label: t("post.share.label"),
    icon: <TbShare />,
    onClick: shareOrCopyUrl,
  });

  if (myProfile && post.author.did === myProfile.did) {
    moreActions.push({
      label: t("post.delete.do"),
      icon: <TbTrash />,
      onClick: () =>
        window.confirm(t("post.delete.confirm")) && deleteMutation({ post }),
      danger: true,
    });
  }

  if (moreActions.length === 0) return null;

  return <Menu actions={moreActions} button={button} />;
}
