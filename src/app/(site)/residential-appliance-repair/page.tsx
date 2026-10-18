import { SegmentPage, segmentMetadata } from "@/components/sections/SegmentPage";

export const generateMetadata = () => segmentMetadata("residential");

export default function ResidentialPage() {
  return <SegmentPage segment="residential" />;
}
