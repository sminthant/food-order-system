import {
  Beef,
  CakeSlice,
  CupSoda,
  Drumstick,
  Pizza,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIcon } from "@/types";

const icons: Record<CategoryIcon, LucideIcon> = {
  beef: Beef,
  pizza: Pizza,
  drumstick: Drumstick,
  soup: Soup,
  "cup-soda": CupSoda,
  cake: CakeSlice,
  utensils: UtensilsCrossed,
};

export function CategoryGlyph({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = icons[icon as CategoryIcon] ?? UtensilsCrossed;
  return <Icon className={className} aria-hidden />;
}
