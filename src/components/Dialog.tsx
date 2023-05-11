import { Dialog as CamomeDialog, dialogClassNames } from "@camome/core/Dialog";
import {
  Dialog as HeadlessDialog,
  Transition,
  TransitionClasses,
} from "@headlessui/react";
import clsx from "clsx";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
  transitions?: {
    backdrop?: TransitionClasses;
    panel?: TransitionClasses;
  };
  refs?: {
    panel?: React.Ref<HTMLDivElement>;
  };
  showBackdrop?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function Dialog({
  open,
  onClose,
  title,
  initialFocus,
  transitions,
  refs,
  showBackdrop,
  children,
  className,
}: Props) {
  return (
    <Transition appear show={open} as={React.Fragment}>
      <HeadlessDialog
        as="div"
        onClose={onClose}
        initialFocus={initialFocus}
        className={clsx(dialogClassNames.container, className)}
      >
        {showBackdrop && (
          <Transition.Child
            as={React.Fragment}
            {...(transitions?.backdrop ? transitions.backdrop : {})}
          >
            <div className={dialogClassNames.backdrop} />
          </Transition.Child>
        )}
        <div className={dialogClassNames.panelWrapper}>
          <Transition.Child
            as={React.Fragment}
            {...(transitions?.panel ? transitions.panel : {})}
          >
            <HeadlessDialog.Panel
              className={clsx(dialogClassNames.panel, "scrollbar")}
              ref={refs?.panel}
            >
              <CamomeDialog.Close onClick={onClose} />
              <HeadlessDialog.Title className={dialogClassNames.title}>
                {title}
              </HeadlessDialog.Title>
              <div className={dialogClassNames.content}>{children}</div>
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
