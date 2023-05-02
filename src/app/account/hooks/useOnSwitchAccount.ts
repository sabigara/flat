import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import toast from "react-hot-toast";
import { useNavigate, useRevalidator } from "react-router-dom";

import { queryKeys } from "@/src/app/root/lib/queryKeys";

type Options = {
  goHome: boolean;
};

type FnOptions = {
  isSignIn: boolean;
};

export function useOnSwitchAccount(opt: Options) {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const queryClient = useQueryClient();

  const onSwitchAccount = (fnOpt: FnOptions) => {
    revalidator.revalidate();
    queryClient.resetQueries(queryKeys.feed.home.$);
    queryClient.resetQueries(queryKeys.notifications.$);
    if (fnOpt.isSignIn) {
      toast.success(t("auth.sign-in-success"));
    } else {
      toast.success(t("auth.sign-out-success"));
    }
    if (opt.goHome) void navigate("/");
  };

  return onSwitchAccount;
}

export type SwitchAccountHandler = ReturnType<typeof useOnSwitchAccount>;
