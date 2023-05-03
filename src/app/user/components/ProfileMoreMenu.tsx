import { AppBskyActorDefs } from "@atproto/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TbVolume, TbVolumeOff } from "react-icons/tb";

import { getBskyApi, useAtpAgent } from "@/src/app/account/states/atp";
import { userToName } from "@/src/app/user/lib/userToName";
import Menu, { MenuProps } from "@/src/components/Menu";

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
  const { t } = useTranslation();
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
        await getBskyApi().graph.unmuteActor({ actor: profile.did });
      } else {
        await getBskyApi().graph.muteActor({ actor: profile.did });
      }
    },
    onSuccess(_, { profile, muted }) {
      revalidate?.();
      toast.success(
        t(muted ? "graph.unmute-success" : "graph.mute-success", {
          actor: userToName(profile),
        })
      );
    },
  });

  const actions: MenuProps["actions"] = [];

  const atp = useAtpAgent();
  if (atp.session && profile.did !== atp.session.did) {
    actions.push({
      label: muted ? t("graph.unmute") : t("graph.mute"),
      icon: muted ? <TbVolume /> : <TbVolumeOff />,
      onClick: () => muteMutation({ profile, muted }),
    });
  }

  if (actions.length === 0) return null;

  return <Menu actions={actions} button={button} />;
}
