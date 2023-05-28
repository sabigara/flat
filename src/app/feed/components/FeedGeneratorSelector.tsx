import clsx from "clsx";
import { motion } from "framer-motion";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";

import { useCustomFeedsQuery } from "@/src/app/feed/hooks/useCustomFeeds";
import { useScrollEvent } from "@/src/hooks/useScrollEvent";
import { isMobile } from "@/src/lib/platform";

import "overlayscrollbars/overlayscrollbars.css";
import styles from "./FeedGeneratorSelector.module.scss";

type Props = {
  value?: string;
  onChange?: (newVal?: string) => void;
  className?: string;
};

export function FeedGeneratorSelector({ value, onChange, className }: Props) {
  const { data } = useCustomFeedsQuery();
  const makeHandleClick: (newVal?: string) => React.MouseEventHandler =
    (newVal) => () => {
      if (newVal !== value) {
        onChange?.(newVal);
      }
    };

  return (
    <Wrapper className={className}>
      <Item onClick={makeHandleClick()} aria-pressed={!value}>
        フォロー中
      </Item>
      {data?.map((feed) => (
        <Item
          key={feed.uri}
          onClick={makeHandleClick(feed.uri)}
          aria-pressed={value === feed.uri}
        >
          {feed.displayName}
        </Item>
      ))}
    </Wrapper>
  );
}

type ItemProps = React.ComponentProps<"button">;

function Item({ ...props }: ItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line react/prop-types
  const ariaPressed = props["aria-pressed"];

  React.useEffect(() => {
    if (ariaPressed) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "center",
      });
    }
  }, [ariaPressed]);

  return <button className={styles.button} ref={ref} {...props} />;
}

function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [shown, setShown] = React.useState(true);
  const scrollPosBuf = React.useRef<number>();
  const downThreshold = 20;
  const upThreshold = 20;

  useScrollEvent({
    onScroll: React.useCallback(({ position }) => {
      if (position < 50) {
        setShown(true);
        scrollPosBuf.current = undefined;
        return;
      }

      if (scrollPosBuf.current === undefined) {
        scrollPosBuf.current = position;
        return;
      }
      const bufOffset = position - scrollPosBuf.current;
      if (bufOffset >= downThreshold) {
        setShown(false);
        scrollPosBuf.current = undefined;
      } else if (-bufOffset >= upThreshold) {
        setShown(true);
        scrollPosBuf.current = undefined;
      }
    }, []),
  });

  return isMobile() ? (
    <motion.div
      className={clsx(styles.container, styles["container--mobile"], className)}
      initial="shown"
      animate={shown ? "shown" : "hidden"}
      variants={{
        shown: {
          y: 0,
        },
        hidden: {
          y: "-100%",
        },
      }}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {children}
    </motion.div>
  ) : (
    <OverlayScrollbarsComponent
      defer
      options={{
        scrollbars: {
          autoHide: "leave",
          autoHideDelay: 200,
        },
      }}
      className={clsx(styles.container, className, "feedGenerator")}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}
