import { PawPrint } from "lucide-react";
import { fill, getContent, getSite } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/forms/LeadForm";
import { Photo } from "@/components/ui/Photo";
import { CtaBand, PageHero, PetsSection, Process, ReviewsSection, TechnicianSection } from "@/components/sections";

export function generateMetadata() {
  const site = getSite();
  const t = getContent().about;
  return pageMetadata({ title: fill(t.seoTitle, site), description: fill(t.seoDescription, site), path: "/about" });
}

export default function AboutPage() {
  const site = getSite();
  const t = getContent().about;
  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={fill(t.title, site)}
        intro={fill(t.intro, site)}
        crumbs={[{ name: "About", path: "/about" }]}
        aside={
          <Photo
            src={site.photos.hero}
            alt={`${site.technician.name} from ${site.shortName} with a customer's dog after a repair`}
            className="aspect-[4/3] max-h-[420px] rounded-[22px] shadow-[0_20px_50px_rgb(0_0_0/0.25)] lg:aspect-[4/5] lg:max-h-none"
            priority
          >
            {t.photoCaption && (
              <figcaption className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-xl bg-[rgb(10_30_22/0.78)] px-3.5 py-2.5 text-[0.88rem] text-white">
                <PawPrint className="size-5 shrink-0 text-peach" aria-hidden />
                {fill(t.photoCaption, site)}
              </figcaption>
            )}
          </Photo>
        }
      />

      <section className="section">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="prose-kind max-w-[70ch]">
            <h2 className="mb-2 text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)]">{t.whyTitle}</h2>
            {t.paragraphs.map((p, i) => (
              <p key={i}>{fill(p, site)}</p>
            ))}
            <Photo
              src={site.photos.work}
              alt="Technician diagnosing a dishwasher on a protective floor mat"
              className="mt-6 aspect-[4/3] rounded-2xl"
              sizes="(min-width: 1024px) 640px, 100vw"
            />
          </div>

          <div className="card-raised lg:sticky lg:top-24">
            <h2 className="text-[1.4rem]">{t.formTitle}</h2>
            <p className="mt-1 mb-4 text-[0.93rem] text-muted">{fill(t.formIntro, site)}</p>
            <LeadForm formId="about_page" variant="compact" />
          </div>
        </div>
      </section>

      <Process />
      <TechnicianSection />
      <ReviewsSection />
      <PetsSection />
      <CtaBand />
    </>
  );
}
