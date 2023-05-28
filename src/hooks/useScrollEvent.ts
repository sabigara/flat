import React from "react";

type Params = {
  onScroll: (args: { position: number }) => void;
  orientation?: "vertical" | "horizontal";
};

// https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
export function useScrollEvent({ onScroll, orientation = "vertical" }: Params) {
  const lastKnownScrollPosition = React.useRef(0);
  const ticking = React.useRef(false);

  const handleScroll = React.useCallback(() => {
    lastKnownScrollPosition.current =
      orientation === "vertical" ? window.scrollY : window.scrollX;

    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        onScroll({
          position: lastKnownScrollPosition.current,
        });
        ticking.current = false;
      });

      ticking.current = true;
    }
  }, [orientation, onScroll]);

  React.useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
}
