import { Placement } from "@floating-ui/react";

type Origin = {
  originX: number;
  originY: number;
};

export function placementToOrigin(placement: Placement): Origin {
  const [side, alignment] = placement.split("-");

  let originX: number = 0;
  let originY: number = 0;

  switch (side) {
    case "top":
      originY = 1;
      break;
    case "right":
      originX = 0;
      break;
    case "bottom":
      originY = 0;
      break;
    case "left":
      originX = 1;
      break;
  }

  if (alignment) {
    switch (alignment) {
      case "start":
        // No change needed
        break;
      case "end":
        if (side === "top" || side === "bottom") {
          originX = 1 - originX;
        } else {
          originY = 1 - originY;
        }
        break;
    }
  }

  return { originX, originY };
}
