import { Radio } from "@camome/core/Radio";
import { RadioGroup } from "@camome/core/RadioGroup";
import { useImmerAtom } from "jotai-immer";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbFilter } from "react-icons/tb";

import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { FeedFilterReply, FeedFilterRepost } from "@/src/app/feed/lib/types";

import styles from "./FeedFilter.module.scss";

type Register = (
  name: "reply" | "repost",
  value: FeedFilterReply | FeedFilterRepost
) => {
  name: string;
  value: string;
  checked: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
};

export function FeedFilter() {
  const { t } = useTranslation();
  const [settings, setSettings] = useImmerAtom(settingsAtom);
  const {
    tlFilters: { reply, repost },
  } = settings;
  const register: Register = (
    name: "reply" | "repost",
    value: FeedFilterReply | FeedFilterRepost
  ) => {
    return {
      name,
      value,
      checked: (name === "reply" ? reply : repost) === value,
      onChange: (e) => {
        if (e.currentTarget.checked) {
          if (e.currentTarget.name === "reply") {
            setSettings((draft) => {
              draft.tlFilters.reply = e.currentTarget.value as FeedFilterReply;
            });
          } else {
            setSettings((draft) => {
              draft.tlFilters.repost = e.currentTarget
                .value as FeedFilterRepost;
            });
          }
        }
      },
    };
  };

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <TbFilter />
        <span className={styles.summary__label}>{t("feed.filters.title")}</span>
      </summary>
      <div className={styles.content}>
        <RadioGroup
          label={t("post.reply.title")}
          aria-required
          orientation="horizontal"
        >
          <Radio
            label={t("feed.filters.reply.all")}
            size={RADIO_SIZE}
            {...register("reply", "all")}
          />
          <Radio
            label={t("feed.filters.reply.following")}
            size={RADIO_SIZE}
            {...register("reply", "following")}
          />
          <Radio
            label={t("feed.filters.reply.none")}
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
            label={t("feed.filters.repost.all")}
            size={RADIO_SIZE}
            {...register("repost", "all")}
          />
          <Radio
            label={t("feed.filters.repost.latest")}
            size={RADIO_SIZE}
            {...register("repost", "latest")}
          />
          <Radio
            label={t("feed.filters.repost.none")}
            size={RADIO_SIZE}
            {...register("repost", "none")}
          />
        </RadioGroup>
      </div>
    </details>
  );
}

const RADIO_SIZE = "sm" as const;
