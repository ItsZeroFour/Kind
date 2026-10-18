import { notFound } from "next/navigation";
import { getSectionDef } from "@/content/model";
import { getContent, sectionMeta } from "@/content/store";
import { requireUser } from "@/lib/auth";
import { ContentEditor } from "../../../_components/ContentEditor";
import { PageHead } from "../../../_components/PageHead";

const previews: Record<string, string> = {
  business: "/",
  brand: "/about",
  home: "/",
  blocks: "/",
  about: "/about",
  residential: "/residential-appliance-repair",
  commercial: "/commercial-appliance-repair",
  services: "/services",
  areas: "/service-areas",
  faqs: "/faq",
  reviews: "/reviews",
  pages: "/services",
  form: "/book",
  prices: "/pricing",
};

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: getSectionDef((await params).section)?.title ?? "Section" };
}

export default async function SectionPage({ params }: Props) {
  await requireUser();
  const def = getSectionDef((await params).section);
  if (!def) notFound();
  const value = getContent()[def.key] as unknown as Record<string, unknown>;
  const isCustom = Boolean(sectionMeta()[def.key]);
  return (
    <>
      <PageHead title={def.title} description={def.description} preview={previews[def.key]} />
      <ContentEditor key={def.key} def={def} initial={value} isCustom={isCustom} />
    </>
  );
}
