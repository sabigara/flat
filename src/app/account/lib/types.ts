import { PostImageLayout } from "@/src/app/post/lib/types";
import { Theme } from "@/src/app/theme/lib/types";
import { TlFilers } from "@/src/app/timeline/lib/types";

export type Settings = {
  theme: Theme;
  tlFilters: TlFilers;
  postImageLayout: PostImageLayout;
};
