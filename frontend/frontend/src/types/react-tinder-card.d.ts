declare module "react-tinder-card" {
  import * as React from "react";

  export type Direction = "left" | "right" | "up" | "down";

  export interface TinderCardProps {
    children?: React.ReactNode;
    className?: string;
    key?: string | number;
    onSwipe?: (direction: Direction) => void;
    onCardLeftScreen?: (identifier: string) => void;
    preventSwipe?: Direction[];
  }

  const TinderCard: React.FC<TinderCardProps>;
  export default TinderCard;
}
