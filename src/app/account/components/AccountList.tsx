import clsx from "clsx";
import { useAtom } from "jotai";

import { AccountListItem } from "@/src/app/account/components/AccountListItem";
import {
  makeAtpAgentCacheKey,
  sessionsAtom,
} from "@/src/app/account/states/atp";

import styles from "./AccountList.module.scss";

type Props = {
  onSwitchAccount?: () => void;
  showLogOut?: boolean;
  className?: string;
};

export function AccountList({ onSwitchAccount, showLogOut, className }: Props) {
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
          showLogOut={showLogOut}
          className={styles.item}
        />
      ))}
    </ul>
  );
}
