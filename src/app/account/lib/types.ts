import { AtpSessionData } from "@atproto/api";

import { PostImageLayout } from "@/src/app/post/lib/types";
import { Theme } from "@/src/app/theme/lib/types";
import { TlFilers } from "@/src/app/timeline/lib/types";

export type Sessions = {
  // key is did
  accounts: Record<string, { session: AtpSessionData | null; service: string }>;
  currentDid: string | null;
};

export type Settings = {
  theme: Theme;
  tlFilters: TlFilers;
  postImageLayout: PostImageLayout;
};
