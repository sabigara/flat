import { AppBskyActorDefs, AtUri } from "@atproto/api";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TbVolume, TbVolumeOff, TbBan, TbCircleCheck } from "react-icons/tb";

import {
  getAtpAgent,
  getBskyApi,
  useAtpAgent,
} from "@/src/app/account/states/atp";
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
  const isMuted = !!profile.viewer?.muted;
  const isBlocking = !!profile.viewer?.blocking;
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
        }),
      );
    },
  });

  const { mutate: blockMutation } = useMutation({
    async mutationFn({
      profile,
      blocking,
    }: {
      profile: AppBskyActorDefs.ProfileViewDetailed;
      blocking?: string;
    }) {
      const session = getAtpAgent().session;
      if (!session) throw new Error("Not logged in");

      if (blocking) {
        if (!profile.viewer?.blocking) throw new Error("Not blocking");
        const uri = new AtUri(profile.viewer.blocking);
        await getBskyApi().graph.block.delete({
          repo: session.did,
          rkey: uri.rkey,
        });
      } else {
        await getBskyApi().graph.block.create(
          { repo: session.did },
          {
            subject: profile.did,
            createdAt: new Date().toISOString(),
          },
        );
      }
    },
    onSuccess(_, { profile, blocking: muted }) {
      revalidate?.();
      toast.success(
        t(muted ? "graph.unblock-success" : "graph.block-success", {
          actor: userToName(profile),
        }),
      );
    },
  });

  const actions: MenuProps["actions"] = [];

  const atp = useAtpAgent();
  if (atp.session && profile.did !== atp.session.did) {
    actions.push(
      {
        label: isMuted ? t("graph.unmute") : t("graph.mute"),
        icon: isMuted ? <TbVolume /> : <TbVolumeOff />,
        onClick: () => muteMutation({ profile, muted: isMuted }),
      },
      {
        label: isBlocking ? t("graph.unblock") : t("graph.block"),
        icon: isBlocking ? <TbCircleCheck /> : <TbBan />,
        onClick: () =>
          blockMutation({ profile, blocking: profile.viewer?.blocking }),
      },
    );
  }

  if (actions.length === 0) return null;

  return <Menu actions={actions} button={button} />;
}
