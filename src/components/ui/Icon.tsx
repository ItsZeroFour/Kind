import {
  BadgeCheck, Building2, CalendarCheck, Camera, CircleCheck, CircleDollarSign, Clock, Hammer, Heart, Home,
  MessageSquareText, PawPrint, Phone, Search, ShieldCheck, Sparkles, Star, Tag, Truck, Wrench,
  type LucideIcon, type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/model";

export const icons: Record<IconName, LucideIcon> = {
  calendar: CalendarCheck,
  message: MessageSquareText,
  truck: Truck,
  search: Search,
  wrench: Wrench,
  badge: BadgeCheck,
  dollar: CircleDollarSign,
  paw: PawPrint,
  clock: Clock,
  tag: Tag,
  camera: Camera,
  hammer: Hammer,
  shield: ShieldCheck,
  star: Star,
  home: Home,
  building: Building2,
  phone: Phone,
  check: CircleCheck,
  heart: Heart,
  sparkles: Sparkles,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = icons[name as IconName] ?? CircleCheck;
  return <C {...props} />;
}
