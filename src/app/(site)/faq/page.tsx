import { fill, getContent, getFaqs, getServices } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { CtaBand, FaqList, PageHero } from "@/components/sections";

export const generateMetadata = () => editableMetadata("faq", "/faq");

export default function FaqPage() {
  const t = getContent().pages.faq;
  const generalFaqs = getFaqs();
  const serviceFaqs = getServices().flatMap((s) => s.faqs);
  return (
    <>
      <JsonLd data={faqSchema([...generalFaqs, ...serviceFaqs])} />
      <PageHero
        eyebrow={t.eyebrow}
        title={fill(t.heading)}
        intro={fill(t.intro)}
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />
      <section className="section">
        <div className="container-x max-w-4xl">
          {generalFaqs.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold">{t.generalTitle}</h2>
              <div className="mt-6 mb-14">
                <FaqList faqs={generalFaqs} schema={false} />
              </div>
            </>
          )}
          {serviceFaqs.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold">{t.specificTitle}</h2>
              <div className="mt-6">
                <FaqList faqs={serviceFaqs} schema={false} />
              </div>
            </>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
