import { Radio } from "@camome/core/Radio";
import { RadioGroup } from "@camome/core/RadioGroup";
import { useAtom } from "jotai";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbFilter } from "react-icons/tb";

import { TlFilterReply, TlFilterRepost } from "@/src/app/timeline/lib/types";
import {
  tlFilterReplyAtom,
  tlFilterRepostAtom,
} from "@/src/app/timeline/states/tlFilterAtoms";

import styles from "./TimelineFilter.module.scss";

type Register = (
  name: "reply" | "repost",
  value: TlFilterReply | TlFilterRepost
) => {
  name: string;
  value: string;
  checked: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
};

export function TimelineFilter() {
  const { t } = useTranslation("common");
  const [reply, setReply] = useAtom(tlFilterReplyAtom);
  const [repost, setRepost] = useAtom(tlFilterRepostAtom);
  const register: Register = (
    name: "reply" | "repost",
    value: TlFilterReply | TlFilterRepost
  ) => {
    return {
      name,
      value,
      checked: (name === "reply" ? reply : repost) === value,
      onChange: (e) => {
        if (e.currentTarget.checked) {
          if (e.currentTarget.name === "reply") {
            setReply(e.currentTarget.value as TlFilterReply);
          } else {
            setRepost(e.currentTarget.value as TlFilterRepost);
          }
        }
      },
    };
  };

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <TbFilter />
        <span className={styles.summary__label}>
          {t("timeline.filters.title")}
        </span>
      </summary>
      <div className={styles.content}>
        <RadioGroup
          label={t("post.reply.title")}
          aria-required
          orientation="horizontal"
        >
          <Radio
            label={t("timeline.filters.reply.all")}
            size={RADIO_SIZE}
            {...register("reply", "all")}
          />
          <Radio
            label={t("timeline.filters.reply.following")}
            size={RADIO_SIZE}
            {...register("reply", "following")}
          />
          <Radio
            label={t("timeline.filters.reply.none")}
            size={RADIO_SIZE}
            {...register("reply", "none")}
          />
        </RadioGroup>
        <RadioGroup
          label={t("post.repost.title")}
          aria-required
          orientation="horizontal"
        >
          <Radio
            label={t("timeline.filters.repost.all")}
            size={RADIO_SIZE}
            {...register("repost", "all")}
          />
          <Radio
            label={t("timeline.filters.repost.latest")}
            size={RADIO_SIZE}
            {...register("repost", "latest")}
          />
          <Radio
            label={t("timeline.filters.repost.none")}
            size={RADIO_SIZE}
            {...register("repost", "none")}
          />
        </RadioGroup>
      </div>
    </details>
  );
}

const RADIO_SIZE = "sm" as const;
