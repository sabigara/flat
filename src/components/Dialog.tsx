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
  setOpen: (open: boolean) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  transitions?: {
    backdrop?: TransitionClasses;
    panel?: TransitionClasses;
  };
};

export default function Dialog({
  open,
  setOpen,
  title,
  children,
  className,
  transitions,
}: Props) {
  return (
    <Transition appear show={open} as={React.Fragment}>
      <HeadlessDialog
        as="div"
        onClose={setOpen}
        className={clsx(dialogClassNames.container, className)}
      >
        <Transition.Child
          as={React.Fragment}
          {...(transitions?.backdrop ? transitions.backdrop : {})}
        >
          <div className={dialogClassNames.backdrop} />
        </Transition.Child>
        <div className={dialogClassNames.panelWrapper}>
          <Transition.Child
            as={React.Fragment}
            {...(transitions?.panel ? transitions.panel : {})}
          >
            <HeadlessDialog.Panel className={dialogClassNames.panel}>
              <CamomeDialog.Close onClick={() => setOpen(false)} />
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
