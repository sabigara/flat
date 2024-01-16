import { Tag } from "@camome/core/Tag";
import clsx from "clsx";
import { motion } from "framer-motion";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useCustomFeedsQuery } from "@/src/app/feed/hooks/useCustomFeeds";
import { Keybinding } from "@/src/components/Keybinding";
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
  const { data, status } = useCustomFeedsQuery();
  const makeHandleClick: (newVal?: string) => () => void = (newVal) => () => {
    if (newVal !== value) {
      onChange?.(newVal);
    }
  };
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const feeds = (() => {
    if (status === "loading") {
      return (
        <>
          <ItemSkelton />
          <ItemSkelton />
          <ItemSkelton />
          <ItemSkelton />
        </>
      );
    }
    if (status === "error" || !data) {
      return (
        <Tag colorScheme="danger" size="sm">
          Failed to fetch feeds
        </Tag>
      );
    }
    return (
      <>
        {data?.map((feed, i) => (
          <Item
            key={feed.uri}
            onClick={makeHandleClick(feed.uri)}
            aria-pressed={value === feed.uri}
            index={i + 1} // +1 for following
          >
            {feed.displayName}
          </Item>
        ))}
      </>
    );
  })();

  React.useEffect(() => {
    const wrapperElm = isMobile()
      ? wrapperRef.current
      : wrapperRef.current?.querySelector(".os-viewport");
    if (!wrapperElm) return;
    const pressedElm = wrapperElm.querySelector(`[aria-pressed="true"]`);
    wrapperElm.scrollTo({
      behavior: "smooth",
      left: pressedElm
        ? pressedElm.getBoundingClientRect().left -
          wrapperElm.getBoundingClientRect().left +
          wrapperElm.scrollLeft -
          16
        : 0,
    });
  }, [status, value]);

  return (
    <Wrapper className={className} ref={wrapperRef}>
      <Item onClick={makeHandleClick()} aria-pressed={!value} index={0}>
        Following
      </Item>
      {feeds}
    </Wrapper>
  );
}

type ItemProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  index: number;
  onClick: () => void;
};

const Item = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ index, ...props }, forwardedRef) => {
    const number = index + 1;
    useHotkeys(`${number}`, () => {
      props.onClick();
    });
    return (
      <Keybinding kbd={number.toString()} side="bottom">
        <button className={styles.button} ref={forwardedRef} {...props} />
      </Keybinding>
    );
  },
);

Item.displayName = "Item";

function ItemSkelton() {
  return <div className={styles.skelton} />;
}

const Wrapper = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
  }
>(({ children, className }, forwardedRef) => {
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
      ref={forwardedRef}
    >
      {children}
    </motion.div>
  ) : (
    <OverlayScrollbarsComponent<"div">
      options={{
        scrollbars: {
          autoHide: "leave",
          autoHideDelay: 200,
        },
      }}
      className={clsx(styles.container, className, "feedGenerator")}
      ref={(ins) => {
        const elm = ins?.getElement() ?? null;
        if (typeof forwardedRef === "function") {
          forwardedRef(elm);
        } else if (forwardedRef) {
          forwardedRef.current = elm;
        }
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
});

Wrapper.displayName = "Wrapper";
