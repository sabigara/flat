import clsx from "clsx";
import { useAtom } from "jotai";

import {
  AccountListItem,
  AccountListItemAdd,
} from "@/src/app/account/components/AccountListItem";
import {
  makeAtpAgentCacheKey,
  sessionsAtom,
} from "@/src/app/account/states/atp";

import styles from "./AccountList.module.scss";

type Props = {
  onSwitchAccount?: () => void;
  showLogOut?: boolean;
  showAdd?: boolean;
  disableLoggedIn?: boolean;
  className?: string;
};

export function AccountList({
  onSwitchAccount,
  showLogOut,
  showAdd = true,
  disableLoggedIn,
  className,
}: Props) {
  const [sessions] = useAtom(sessionsAtom);
  return (
    <ul className={clsx(styles.container, className)}>
      {Object.entries(sessions.accounts).map(([, account]) => (
        <AccountListItem
          key={makeAtpAgentCacheKey({
            service: account.service,
            did: account.did,
          })}
          account={account}
          onSwitchAccount={onSwitchAccount}
          disableLoggedIn={disableLoggedIn}
          showLogOut={showLogOut}
          className={styles.item}
        />
      ))}
      {showAdd && (
        <AccountListItemAdd className={clsx(styles.item, styles.add)} />
      )}
    </ul>
  );
}
