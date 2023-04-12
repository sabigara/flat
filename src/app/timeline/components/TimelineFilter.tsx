import { Radio } from "@camome/core/Radio";
import { RadioGroup } from "@camome/core/RadioGroup";
import { useAtom } from "jotai";
import React from "react";
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
        <span className={styles.summary__label}>表示オプション</span>
      </summary>
      <div className={styles.content}>
        <RadioGroup label="リプライ" aria-required orientation="horizontal">
          <Radio
            label="すべて"
            size={RADIO_SIZE}
            {...register("reply", "all")}
          />
          <Radio
            label="フォロー中"
            size={RADIO_SIZE}
            {...register("reply", "following")}
          />
          <Radio
            label="非表示"
            size={RADIO_SIZE}
            {...register("reply", "none")}
          />
        </RadioGroup>
        <RadioGroup label="リポスト" aria-required orientation="horizontal">
          <Radio
            label="すべて"
            size={RADIO_SIZE}
            {...register("repost", "all")}
          />
          <Radio
            label="最新のみ"
            size={RADIO_SIZE}
            {...register("repost", "latest")}
          />
          <Radio
            label="非表示"
            size={RADIO_SIZE}
            {...register("repost", "none")}
          />
        </RadioGroup>
      </div>
    </details>
  );
}

const RADIO_SIZE = "sm" as const;
