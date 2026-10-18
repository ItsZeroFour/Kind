import { fill, getContent, getIntegrations } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/sections";
import { ContactAside } from "@/components/sections/ContactAside";

export const generateMetadata = () => editableMetadata("book", "/book");

export default function BookPage() {
  const t = getContent().pages.book;
  const bookingUrl = getIntegrations().bookingUrl;
  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={fill(t.heading)}
        intro={fill(t.intro)}
        crumbs={[{ name: "Book a Service", path: "/book" }]}
        hideCtas
      />
      <section className="section">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
          <div className="card-raised !p-5 sm:!p-8">
            {bookingUrl ? (
              <iframe src={bookingUrl} title="Online booking" className="h-[900px] w-full rounded-2xl border-0" loading="lazy" allow="payment" />
            ) : (
              <LeadForm formId="book_page" variant="full" />
            )}
          </div>
          <ContactAside location="book_aside" />
        </div>
      </section>
    </>
  );
}
