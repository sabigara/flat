import { RichText } from "@atproto/api";
import { Placement, flip, offset, useFloating } from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useAtpAgent } from "@/src/app/account/states/atp";
import { useMobileSize } from "@/src/app/root/hooks/useMobileSize";
import Avatar from "@/src/app/user/components/Avatar";
import { FollowButton } from "@/src/app/user/components/FollowButton";
import { useProfileQuery } from "@/src/app/user/hooks/useProfileQuery";
import { RichTextRenderer } from "@/src/components/RichTextRenderer";

import styles from "./UserPopover.module.scss";

type Props = {
  identifier: string;
  placement?: Placement;
  children: React.ReactNode;
};

export default function UserPopover({
  identifier,
  placement,
  children,
}: Props) {
  const location = useLocation();
  const isMobileSize = useMobileSize();
  const { x, y, reference, floating, strategy, update } = useFloating({
    placement,
    middleware: [offset(8), flip()],
  });
  const [open, setOpen] = React.useState(false);
  const timeout = React.useRef<number>();

  const handleMouseEnter: React.MouseEventHandler = () => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => void setOpen(true), 750);
  };

  const handleMouseLeave: React.MouseEventHandler = () => {
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => void setOpen(false), 200);
  };

  const handleClickContent: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  if (location.pathname === `/${identifier}` || isMobileSize) {
    return <>{children}</>;
  }

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={reference}
        className={styles.targetWrap}
      >
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClickContent}
            initial="closed"
            exit="closed"
            animate={open ? "open" : "closed"}
            variants={{
              open: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0,
                  duration: 0.3,
                },
              },
              closed: {
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
            className={styles.content}
            style={{
              position: strategy,
              left: x ?? 0,
              top: y ?? 0,
            }}
          >
            <Content identifier={identifier} onLoad={update} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type ContentProps = {
  identifier: string;
  onLoad?: () => void;
};

function Content({ identifier, onLoad }: ContentProps) {
  const {
    data: profile,
    status,
    refetch,
  } = useProfileQuery({ identifier, onSuccess: onLoad });
  const atp = useAtpAgent();
  const isMyself =
    !!atp.session && !!profile && atp.session.did === profile.did;
  const href = `/${identifier}`;

  const loading = <Skelton />;
  const error = <>Error</>;

  const success = (() => {
    if (!profile) return error;

    const rt = profile.description
      ? new RichText({
          text: profile.description,
        })
      : undefined;
    rt?.detectFacetsWithoutResolution();

    return (
      <div>
        <div className={styles.avatarRow}>
          <Avatar size="lg" profile={profile} isLink />
          {!isMyself && (
            <FollowButton profile={profile} size="sm" onSuccess={refetch} />
          )}
        </div>
        {profile.displayName && (
          <Link to={href} className={styles.displayName}>
            {profile.displayName}
          </Link>
        )}
        <Link to={href} className={styles.handle}>
          @{profile.handle}
        </Link>
        {rt && (
          <RichTextRenderer
            text={rt.text}
            facets={rt.facets}
            className={styles.description}
          />
        )}
      </div>
    );
  })();

  switch (status) {
    case "loading":
      return loading;
    case "error":
      return error;
    case "success":
      return success;
  }
}

function Skelton() {
  return (
    <div className={styles.skelton}>
      <div className={styles.skelton__avatar} />
      <div className={styles.skelton__displayName} />
      <div className={styles.skelton__handle} />
      <div className={styles.skelton__description} />
    </div>
  );
}
