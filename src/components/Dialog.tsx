import { Box } from "@camome/core/Box";
import { Dialog as CamomeDialog, dialogClassNames } from "@camome/core/Dialog";
import {
  Dialog as HeadlessDialog,
  Transition,
  TransitionClasses,
} from "@headlessui/react";
import clsx from "clsx";
import React from "react";

import { createPolymorphicComponent } from "@/src/lib/createPolymorphicComponent";

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
  transitionEnabled?: boolean;
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
  transitionEnabled = true,
  children,
  className,
}: Props) {
  return (
    <WrapIf
      component={Transition}
      condition={transitionEnabled}
      appear
      show={open}
      as={React.Fragment}
    >
      <HeadlessDialog
        as="div"
        open={transitionEnabled ? undefined : open}
        onClose={onClose}
        initialFocus={initialFocus}
        className={clsx(dialogClassNames.container, className)}
      >
        {showBackdrop && (
          <WrapIf
            component={Transition.Child}
            condition={transitionEnabled}
            as={React.Fragment}
            {...(transitions?.backdrop ? transitions.backdrop : {})}
          >
            <div className={dialogClassNames.backdrop} />
          </WrapIf>
        )}
        <div className={dialogClassNames.panelWrapper}>
          <WrapIf
            component={Transition.Child}
            condition={transitionEnabled}
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
          </WrapIf>
        </div>
      </HeadlessDialog>
    </WrapIf>
  );
}

type WrapIfProps = {
  component: any;
  condition: boolean;
  children: React.ReactNode;
};

function _WrapIf({ component, condition, children, ...props }: WrapIfProps) {
  if (!condition) return children;
  return (
    <Box component={component} {...props}>
      {children}
    </Box>
  );
}

export const WrapIf = createPolymorphicComponent<"div", WrapIfProps>(_WrapIf);
