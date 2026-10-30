import { getContent } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const generateMetadata = () => editableMetadata("terms", "/terms");

export default function TermsPage() {
  const t = getContent().pages.terms;
  return <LegalPage heading={t.heading} path="/terms" updated={t.updated} intro={t.intro} blocks={t.blocks} />;
}
