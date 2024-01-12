import { Radio } from "@camome/core/Radio";
import { RadioGroup } from "@camome/core/RadioGroup";
import { Select } from "@camome/core/Select";
import { useImmerAtom } from "jotai-immer";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

import type { RootContext } from "@/src/app/root/routes/RootRoute/RootRoute";
import type { Theme } from "@/src/app/theme/lib/types";

import { Mode } from "@/src/app/account/lib/types";
import { settingsAtom } from "@/src/app/account/states/settingsAtom";
import { FeedFilterReply, FeedFilterRepost } from "@/src/app/feed/lib/types";
import { InFeedThreadMode, PostImageLayout } from "@/src/app/post/lib/types";
import Seo from "@/src/app/seo/Seo";

import styles from "./SettingsRoute.module.scss";

type RegisterFeedFilter = (
  name: "reply" | "repost",
  value: FeedFilterReply | FeedFilterRepost,
) => {
  name: string;
  value: string;
  checked: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
};

const RADIO_SIZE = "sm" as const;

export function SettingsRoute() {
  const { t, i18n } = useTranslation();
  const { t: settingsT } = useTranslation("settings");
  const [settings, setSettings] = useImmerAtom(settingsAtom);
  const { theme } = useOutletContext<RootContext>();

  const {
    tlFilters: { reply, repost },
  } = settings;
  const register: RegisterFeedFilter = (
    name: "reply" | "repost",
    value: FeedFilterReply | FeedFilterRepost,
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
    <>
      <Seo title={settingsT("title")} />
      <div className={styles.container}>
        <h1 className={styles.title}>{settingsT("title")}</h1>

        <section className={styles.section}>
          <h2>{settingsT("appearance.title")}</h2>

          <Select
            label={settingsT("appearance.mode.title")}
            size="md"
            value={settings.mode}
            onChange={(e) =>
              setSettings((draft) => void (draft.mode = e.target.value as Mode))
            }
          >
            <option value="all">
              {settingsT("appearance.mode.options.all")}
            </option>
            <option value="zen">
              {settingsT("appearance.mode.options.zen")}
            </option>
          </Select>

          <Select
            label={settingsT("appearance.theme.title")}
            size="md"
            value={theme.value}
            onChange={(e) => theme.set(e.target.value as Theme)}
          >
            <option value="light">
              {settingsT("appearance.theme.options.light")}
            </option>
            <option value="dark">
              {settingsT("appearance.theme.options.dark")}
            </option>
            <option value="system">
              {settingsT("appearance.theme.options.system")}
            </option>
          </Select>

          <Select
            label={settingsT("appearance.image-layout.title")}
            size="md"
            value={settings.postImageLayout}
            onChange={(e) =>
              setSettings(
                (draft) =>
                  void (draft.postImageLayout = e.target
                    .value as PostImageLayout),
              )
            }
          >
            <option value="stack">
              {settingsT("appearance.image-layout.options.stack")}
            </option>
            <option value="compact">
              {settingsT("appearance.image-layout.options.compact")}
            </option>
          </Select>

          <Select
            label={settingsT("appearance.in-feed-thread.title")}
            size="md"
            value={settings.inFeedThreadMode}
            onChange={(e) =>
              setSettings(
                (draft) =>
                  void (draft.inFeedThreadMode = e.target
                    .value as InFeedThreadMode),
              )
            }
          >
            <option value="aggregate">
              {settingsT("appearance.in-feed-thread.options.aggregate")}
            </option>
            <option value="reverse-chronological">
              {settingsT(
                "appearance.in-feed-thread.options.reverse-chronological",
              )}
            </option>
          </Select>
        </section>

        <section className={styles.section}>
          <h2>{settingsT("language.title")}</h2>
          <Select
            label={settingsT("language.title")}
            size="md"
            value={i18n.resolvedLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </Select>
        </section>

        {/* FIXME */}
        <section className={styles.section}>
          <h2>{settingsT("content-filters.title")}</h2>
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
        </section>
      </div>
    </>
  );
}
