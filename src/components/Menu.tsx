import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu as HlMenu } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

import styles from "./Menu.module.scss";

type Props = {
  button: React.ReactNode;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[];
};

export default function Menu({ button, actions }: Props) {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });

  if (actions.length === 0) return null;

  return (
    <HlMenu as="div" className={styles.menu}>
      <HlMenu.Button as={React.Fragment} ref={reference}>
        {button}
      </HlMenu.Button>
      <HlMenu.Items
        className={clsx(menuClassNames.menu, styles.menu__items)}
        ref={floating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        {actions.map(({ label, icon, onClick, danger }) => (
          <HlMenu.Item key={label} as={React.Fragment}>
            {({ active, disabled }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className={clsx(
                  menuClassNames.item,
                  styles.menu__item,
                  active && menuClassNames.itemActive,
                  disabled && menuClassNames.itemDisabled,
                  danger && styles.danger
                )}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            )}
          </HlMenu.Item>
        ))}
      </HlMenu.Items>
    </HlMenu>
  );
}
