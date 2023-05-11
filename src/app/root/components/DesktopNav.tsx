import { IconButton } from "@camome/core/IconButton";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { RiNotification2Line } from "react-icons/ri";
import {
  TbSearch,
  TbSettings,
  TbHome2,
  TbUser,
  TbInfoCircle,
} from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import { useUnreadCountQuery } from "@/src/app/notification/hooks/useUnreadCountQuery";
import Avatar from "@/src/app/user/components/Avatar";
import LogoIcon from "@/src/assets/icon.svg";
import { config } from "@/src/config";
import { externalLinkAttrs } from "@/src/lib/html";

import styles from "./DesktopNav.module.scss";

export function DesktopNav() {
  const { t, i18n } = useTranslation();
  const { data: account } = useAccountQuery();
  const { data: count } = useUnreadCountQuery();
  const { pathname } = useLocation();

  const navItems: {
    label: string;
    icon: React.ReactNode;
    to: string;
    showBadge?: boolean;
    badgeLabel?: string;
    className?: string;
  }[] = [
    {
      label: t("navigation.home"),
      icon: <TbHome2 />,
      to: "/",
    },
    {
      label: t("navigation.notifications"),
      icon: <RiNotification2Line />,
      to: "/notifications",
      showBadge: !!count && count > 0,
      badgeLabel: `${count}件の通知`, // TODO: i18n
      className: styles.notif,
    },
    {
      label: t("navigation.search"),
      icon: <TbSearch />,
      to: "/search",
    },
    {
      label: t("navigation.profile"),
      icon: <TbUser />,
      to: `/${account?.session.handle}`,
    },
    {
      label: t("navigation.settings"),
      icon: <TbSettings />,
      to: "/settings",
    },
  ];

  return (
    <header className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.upper}>
          <Link to="/" className={styles.logo}>
            <LogoIcon />
          </Link>
          {navItems.map(
            ({ label, icon, to, showBadge, badgeLabel, className }) => (
              <IconButton
                aria-label={label}
                component={Link}
                to={to}
                colorScheme="neutral"
                variant="ghost"
                aria-current={pathname === to}
                className={clsx(styles.button, className)}
                key={to}
              >
                {icon}
                {showBadge && (
                  <span className={styles.badge}>
                    <span className="visually-hidden">{badgeLabel}</span>
                  </span>
                )}
              </IconButton>
            )
          )}
        </div>
        <div className={styles.lower}>
          <IconButton
            aria-label="About Flat"
            component="a"
            colorScheme="neutral"
            variant="ghost"
            size="sm"
            href={
              i18n.resolvedLanguage === "ja"
                ? config.aboutUrl.ja
                : config.aboutUrl.en
            }
            {...externalLinkAttrs}
            className={styles.info}
          >
            <TbInfoCircle />
          </IconButton>
          <Avatar
            profile={account?.profile}
            size="md"
            isLink
            to="/accounts"
            className={styles.avatar}
          />
        </div>
      </nav>
    </header>
  );
}
