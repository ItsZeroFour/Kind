import { fill, getContent } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { BrandsStrip, CtaBand, PageHero, Process, ServicesGrid } from "@/components/sections";

export const generateMetadata = () => editableMetadata("services", "/services");

export default function ServicesPage() {
  const t = getContent().pages.services;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={fill(t.heading)} intro={fill(t.intro)} crumbs={[{ name: "Services", path: "/services" }]} />
      <ServicesGrid heading={false} />
      <BrandsStrip />
      <Process />
      <CtaBand />
    </>
  );
}
