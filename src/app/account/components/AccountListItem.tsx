import { AtpAgent } from "@atproto/api";
import { Button } from "@camome/core/Button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { TbCheck } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { useRepoDescriptionQuery } from "@/src/app/account/hooks/useRepoDescription";
import { Sessions } from "@/src/app/account/lib/types";
import {
  signOut,
  switchAccount,
  useResolvedAccountWithSession,
} from "@/src/app/account/states/atp";
import SpinnerFill from "@/src/components/SpinnerFill";

import styles from "./AccountListItem.module.scss";

type Props = {
  account: Sessions["accounts"][number];
  showLogOut?: boolean;
  onSwitchAccount?: () => void;
  className?: string;
};

// TODO: support deletion; not sign out
export function AccountListItem({
  account,
  showLogOut = true,
  onSwitchAccount,
  className,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useRepoDescriptionQuery({
    service: account.service,
    identifier: account.did,
  });
  const currAccount = useResolvedAccountWithSession();

  const reSignIn = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("service", account.service);
    searchParams.set("identifier", account.did);

    try {
      // Create new agent because `getAtpAgent()` may return an agent
      // which is not connected to the account.
      const resp = await new AtpAgent({
        service: account.service,
      }).com.atproto.repo.describeRepo({
        repo: account.did,
      });
      searchParams.set("identifier", resp.data.handle);
    } catch (e) {
      console.error(e);
    }
    navigate("/login?" + searchParams.toString());
  };

  const handleClickSwitch = async () => {
    if (account.session) {
      switchAccount(account.service, account.session.did);
      onSwitchAccount?.();
    } else {
      await reSignIn();
    }
  };
  const handleClickSignOut = () => {
    signOut({ service: account.service, did: account.did });
    onSwitchAccount?.();
  };

  if (isLoading) return <SpinnerFill />;
  if (!data) return <>Error</>;

  const isLoggedIn = currAccount && currAccount.did === account.did;

  return (
    <li className={clsx(styles.container, className)}>
      <button
        className={clsx(styles.accountRadio)}
        onClick={handleClickSwitch}
        disabled={isLoggedIn}
      >
        <div className={styles.check}>
          {isLoggedIn && (
            <div className={styles.check__circle}>
              <TbCheck
                className={styles.check__icon}
                title="Currently logged in"
              />
            </div>
          )}
        </div>
        <div>
          <div className={styles.handle}>@{data.handle}</div>
          <div className={styles.service}>{account.service}</div>
        </div>
      </button>
      <div className={styles.action}>
        {account.session ? (
          showLogOut && (
            <Button
              size="sm"
              colorScheme="neutral"
              variant="ghost"
              onClick={handleClickSignOut}
              className={styles.signOutBtn}
            >
              {t("auth.sign-out")}
            </Button>
          )
        ) : (
          <Button
            size="sm"
            colorScheme="danger"
            variant="ghost"
            onClick={reSignIn}
          >
            {t("auth.sign-in-again")}
          </Button>
        )}
      </div>
    </li>
  );
}
