import { fill, getContent } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/sections";
import { ContactAside } from "@/components/sections/ContactAside";

export const generateMetadata = () => editableMetadata("contact", "/contact");

export default function ContactPage() {
  const t = getContent().pages.contact;
  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={fill(t.heading)} intro={fill(t.intro)} crumbs={[{ name: "Contact", path: "/contact" }]} hideCtas />
      <section className="section">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
          <div className="card-raised !p-5 sm:!p-8">
            <LeadForm formId="contact_page" variant="full" submitLabel={t.submitLabel || undefined} />
          </div>
          <ContactAside location="contact_aside" />
        </div>
      </section>
    </>
  );
}
