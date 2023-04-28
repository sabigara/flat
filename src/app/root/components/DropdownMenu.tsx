import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu } from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbExternalLink } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

import { useAccountQuery } from "@/src/app/account/hooks/useAccountQuery";
import Avatar from "@/src/app/user/components/Avatar";

import styles from "./DropdownMenu.module.scss";

export default function DropdownMenu() {
  const { t, i18n } = useTranslation();
  const { data: account } = useAccountQuery();
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });
  const location = useLocation();
  const isCurrentPage = (href: string) => href === location.pathname;

  const links = (handle: string) =>
    [
      {
        href: `/${handle}`,
        label: t("navigation.profile"),
      },
      {
        href: "/settings",
        label: t("navigation.settings"),
      },
      {
        href: "/accounts",
        label: t("navigation.accounts"),
      },
      {
        href:
          i18n.resolvedLanguage === "ja"
            ? "https://sabigara.notion.site/sabigara/Flat-3be5369d5d6e4548885d02aa5a37a3e2"
            : "https://sabigara.notion.site/sabigara/About-Flat-6b11ebee0aa843839a67180786174888",
        label: t("navigation.about"),
        external: true,
      },
    ] satisfies { href: string; label: string; external?: boolean }[];

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
          {links(account.profile.handle).map(({ href, label, external }) => (
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
                  {...(external
                    ? {
                        rel: "noreferrer noopener",
                        target: "_blank",
                      }
                    : {})}
                >
                  {label}
                  {external && <TbExternalLink />}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      )}
    </Menu>
  );
}
