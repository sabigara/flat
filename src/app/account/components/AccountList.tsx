import clsx from "clsx";
import { useAtom } from "jotai";

import { AccountListItem } from "@/src/app/account/components/AccountListItem";
import { sessionsAtom } from "@/src/app/account/states/atp";

import styles from "./AccountList.module.scss";

type Props = { onSwitchAccount?: () => void; className?: string };

export function AccountList({ onSwitchAccount, className }: Props) {
  const [sessions] = useAtom(sessionsAtom);
  return (
    <ul className={clsx(styles.container, className)}>
      {Object.entries(sessions.accounts).map(([did, account]) => (
        <AccountListItem
          key={`${account.service}:${did}`}
          account={account}
          onSwitchAccount={onSwitchAccount}
          className={styles.item}
        />
      ))}
    </ul>
  );
}
