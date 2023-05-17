import { AtpSessionData } from "@atproto/api";

import { FeedFilers } from "@/src/app/feed/lib/types";
import { InFeedThreadMode, PostImageLayout } from "@/src/app/post/lib/types";
import { Theme } from "@/src/app/theme/lib/types";

export type Account = {
  session: AtpSessionData | null;
  service: string;
  did: string;
};

export type Sessions = {
  // key is `<service>+<did>`
  accounts: Record<string, Account>;
  current: AccountKeys | null;
};

export type AccountKeys = {
  did: string;
  service: string;
};

export type Mode = "all" | "zen";

export type Settings = {
  theme: Theme;
  tlFilters: FeedFilers;
  postImageLayout: PostImageLayout;
  mode: Mode;
  inFeedThreadMode: InFeedThreadMode;
};
