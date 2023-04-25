import { QueryClient } from "@tanstack/react-query";
import { t } from "i18next";

import { notifyError } from "@/src/app/error/lib/notifyError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: import.meta.env.PROD ? 2 : 0,
    },
    mutations: {
      onError(error) {
        notifyError({ error, message: t("errors.general") });
      },
    },
  },
});
