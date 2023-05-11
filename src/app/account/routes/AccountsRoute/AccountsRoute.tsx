import { useTranslation } from "react-i18next";

import { AccountList } from "@/src/app/account/components/AccountList";
import { useOnSwitchAccount } from "@/src/app/account/hooks/useOnSwitchAccount";

import styles from "./AccountsRoute.module.scss";

export function AccountsRoute() {
  const { t } = useTranslation();
  const handleSwitchAccount = useOnSwitchAccount({
    goHome: true,
  });

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("auth.signed-in-accounts")}</h1>
        <AccountList onSwitchAccount={handleSwitchAccount} />
      </div>
    </>
  );
}
