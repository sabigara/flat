import { menuClassNames } from "@camome/core/Menu";
import { useFloating, offset, flip } from "@floating-ui/react";
import { Menu as HlMenu } from "@headlessui/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

import { placementToOrigin } from "@/src/lib/floating";

import styles from "./Menu.module.scss";

export type MenuProps = {
  button: React.ReactNode;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[];
};

export default function Menu({ button, actions }: MenuProps) {
  const { x, y, reference, floating, strategy, placement } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip()],
  });

  if (actions.length === 0) return null;

  const origin = placementToOrigin(placement);

  return (
    <HlMenu as="div" className={styles.menu}>
      {({ open }) => (
        <>
          <HlMenu.Button as={React.Fragment} ref={reference}>
            {button}
          </HlMenu.Button>
          <HlMenu.Items
            as={motion.div}
            className={clsx(menuClassNames.menu, styles.menu__items)}
            initial="closed"
            exit="closed"
            animate={open ? "open" : "closed"}
            variants={{
              open: {
                ...origin,
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.3,
                },
              },
              closed: {
                ...origin,
                scale: 0.8,
                opacity: 0,
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.2,
                },
              },
            }}
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
                      danger && styles.danger,
                    )}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                )}
              </HlMenu.Item>
            ))}
          </HlMenu.Items>
        </>
      )}
    </HlMenu>
  );
}
