import { AppBskyActorDefs } from "@atproto/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { TbVolume, TbVolumeOff } from "react-icons/tb";

import Menu, { MenuProps } from "@/src/components/Menu";
import { atp, bsky } from "@/src/lib/atp";

type Props = {
  profile: AppBskyActorDefs.ProfileViewDetailed;
  button: React.ReactNode;
  revalidate?: () => void;
};

export default function ProfileMoreMenu({
  profile,
  button,
  revalidate,
}: Props) {
  const muted = !!profile.viewer?.muted;
  const { mutate: muteMutation } = useMutation({
    async mutationFn({
      profile,
      muted,
    }: {
      profile: AppBskyActorDefs.ProfileViewDetailed;
      muted: boolean;
    }) {
      if (muted) {
        await bsky.graph.unmuteActor({ actor: profile.did });
      } else {
        await bsky.graph.muteActor({ actor: profile.did });
      }
    },
    onSuccess(_, { profile, muted }) {
      revalidate?.();
      toast.success(
        `${profile.displayName} ${
          muted ? "のミュートを解除しました" : "をミュートしました"
        }`
      );
    },
  });

  const actions: MenuProps["actions"] = [];

  if (atp.session && profile.did !== atp.session.did) {
    actions.push({
      label: muted ? "ミュート解除" : "ミュートする",
      icon: muted ? <TbVolume /> : <TbVolumeOff />,
      onClick: () => muteMutation({ profile, muted }),
    });
  }

  if (actions.length === 0) return null;

  return <Menu actions={actions} button={button} />;
}
