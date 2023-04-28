import { AtpSessionData } from "@atproto/api";

import { PostImageLayout } from "@/src/app/post/lib/types";
import { Theme } from "@/src/app/theme/lib/types";
import { TlFilers } from "@/src/app/timeline/lib/types";

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

export type Settings = {
  theme: Theme;
  tlFilters: TlFilers;
  postImageLayout: PostImageLayout;
};
