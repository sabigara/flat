import { AppBskyActorDefs, AppBskyFeedDefs } from "@atproto/api";
import { AtUri } from "@atproto/uri";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { TbTrash, TbQuote } from "react-icons/tb";

import { usePostComposer } from "@/src/app/post/hooks/usePostComposer";
import Menu from "@/src/components/Menu";
import { bsky } from "@/src/lib/atp";

type Props = {
  myProfile?: AppBskyActorDefs.ProfileViewDetailed;
  post: AppBskyFeedDefs.PostView;
  button: React.ReactNode;
  revalidate?: () => void;
};

export default function PostMoreButton({
  myProfile,
  post,
  button,
  revalidate,
}: Props) {
  const { handleClickQuote } = usePostComposer();
  const toastRef = React.useRef<string>();

  const { mutate: deleteMutation } = useMutation({
    async mutationFn({ post }: { post: AppBskyFeedDefs.PostView }) {
      const { host, rkey } = new AtUri(post.uri);
      await bsky.feed.post.delete({ repo: host, rkey });
    },
    onMutate() {
      toastRef.current = toast.loading("投稿を削除しています");
    },
    onSuccess() {
      toast.success("削除が完了しました", {
        id: toastRef.current,
      });
      revalidate?.();
    },
    onError() {
      toast.dismiss(toastRef.current);
      toast.error("エラーが発生しました");
    },
    onSettled() {
      toastRef.current = undefined;
    },
  });

  const moreActions: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[] = [];

  moreActions.push({
    label: "投稿を引用",
    icon: <TbQuote />,
    onClick: () => handleClickQuote(post),
  });

  if (myProfile && post.author.did === myProfile.did) {
    moreActions.push({
      label: "投稿を削除",
      icon: <TbTrash />,
      onClick: () =>
        window.confirm("削除してよろしいですか？") && deleteMutation({ post }),
      danger: true,
    });
  }

  if (moreActions.length === 0) return null;

  return <Menu actions={moreActions} button={button} />;
}
