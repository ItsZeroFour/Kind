import {
  CookingPot,
  Droplets,
  Microwave,
  Refrigerator,
  Snowflake,
  WashingMachine,
  Wind,
  Wrench,
  Box,
  type LucideProps,
} from "lucide-react";
import type { ServiceIcon as IconName } from "@/content/services";

const map: Record<IconName, React.ComponentType<LucideProps>> = {
  refrigerator: Refrigerator,
  washer: WashingMachine,
  dryer: Wind,
  dishwasher: Droplets,
  oven: CookingPot,
  freezer: Snowflake,
  microwave: Microwave,
  icemaker: Box,
  other: Wrench,
};

export function ServiceIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = map[name];
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
