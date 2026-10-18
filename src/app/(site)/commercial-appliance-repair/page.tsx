import { SegmentPage, segmentMetadata } from "@/components/sections/SegmentPage";

export const generateMetadata = () => segmentMetadata("commercial");

export default function CommercialPage() {
  return <SegmentPage segment="commercial" />;
}
