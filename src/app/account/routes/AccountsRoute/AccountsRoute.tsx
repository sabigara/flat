import { useRevalidator } from "react-router-dom";

import { AccountList } from "@/src/app/account/components/AccountList";

import styles from "./AccountsRoute.module.scss";

export function AccountsRoute() {
  const revalidator = useRevalidator();
  const handleSwitchAccount = () => {
    revalidator.revalidate();
  };
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>アカウント</h1>
        <AccountList onSwitchAccount={handleSwitchAccount} />
      </div>
    </>
  );
}
