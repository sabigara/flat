import { IconButton } from "@camome/core/IconButton";
import { RiNotification2Line } from "react-icons/ri";
import { TbSearch, TbSettings, TbHome2, TbUser } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import { useUnreadCountQuery } from "@/src/app/notification/hooks/useUnreadCountQuery";
import Avatar from "@/src/app/user/components/Avatar";
import LogoIcon from "@/src/assets/icon.svg";

import styles from "./DesktopNav.module.scss";

export function DesktopNav() {
  const { data: account } = useAccountQuery();
  const { data: count } = useUnreadCountQuery();
  const { pathname } = useLocation();

  const navItems: {
    label: string;
    icon: React.ReactNode;
    to: string;
    showBadge?: boolean;
    badgeLabel?: string;
  }[] = [
    {
      label: "Home",
      icon: <TbHome2 />,
      to: "/",
    },
    {
      label: "Notifications",
      icon: <RiNotification2Line />,
      to: "/notifications",
      showBadge: !!count && count > 0,
      badgeLabel: `${count}件の通知`, // TODO: i18n
    },
    {
      label: "Search",
      icon: <TbSearch />,
      to: "/search",
    },
    {
      label: "Profile",
      icon: <TbUser />,
      to: `/${account?.session.handle}`,
    },
    {
      label: "Settings",
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
          {navItems.map(({ label, icon, to, showBadge, badgeLabel }) => (
            <IconButton
              aria-label={label}
              component={Link}
              to={to}
              colorScheme="neutral"
              variant="ghost"
              aria-current={pathname === to}
              className={styles.button}
              key={to}
            >
              {icon}
              {showBadge && (
                <span className={styles.badge}>
                  <span className="visually-hidden">{badgeLabel}</span>
                </span>
              )}
            </IconButton>
          ))}
        </div>
        <Avatar
          profile={account?.profile}
          size="md"
          isLink
          className={styles.avatar}
        />
      </nav>
    </header>
  );
}
