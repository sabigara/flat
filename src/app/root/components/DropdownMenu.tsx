import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import Avatar from "@/src/app/user/components/Avatar";

import styles from "./DropdownMenu.module.scss";

const links = (handle: string) =>
  [
    {
      href: `/${handle}`,
      label: "プロフィール",
    },
    {
      href: "/settings",
      label: "ユーザー設定",
    },
    {
      href: "/about",
      label: "Flatについて",
    },
  ] satisfies { href: string; label: string }[];

export default function DropdownMenu() {
  const { data: account } = useAccountQuery();
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });
  const location = useLocation();
  const isCurrentPage = (href: string) => href === location.pathname;

  return (
    <Menu as="div" className={styles.menu}>
      <div>
        <Menu.Button className={styles.button}>
          <Avatar
            profile={account?.profile}
            size="sm"
            innerRef={reference}
            stopPropagation={false}
            className={styles.avatar}
          />
        </Menu.Button>
      </div>
      {account?.profile && (
        <Menu.Items
          className={menuClassNames.menu}
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          {links(account.profile.handle).map(({ href, label }) => (
            <Menu.Item
              key={href}
              as={React.Fragment}
              disabled={isCurrentPage(href)}
            >
              {({ active, disabled }) => (
                <Link
                  to={href}
                  aria-current={disabled ? "page" : undefined}
                  className={clsx(
                    menuClassNames.item,
                    styles.link,
                    active && menuClassNames.itemActive,
                    disabled && menuClassNames.itemDisabled
                  )}
                >
                  {label}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      )}
    </Menu>
  );
}
