import { ExternalLink } from "lucide-react";
import { fill, getContent, getReviews, getSite } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { CtaBand, PageHero, ReviewCard } from "@/components/sections";

export const generateMetadata = () => editableMetadata("reviews", "/reviews");

export default function ReviewsPage() {
  const site = getSite();
  const reviews = getReviews();
  const t = getContent().pages.reviews;
  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={fill(t.heading)}
        intro={fill(t.intro)}
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
      >
        {site.social.googleReviews ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.social.googleReviews} target="_blank" rel="noopener" className="btn btn-cta">
              {t.googleButton} <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        ) : undefined}
      </PageHero>

      <section className="section">
        <div className="container-x">
          {reviews.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <ReviewCard key={i} r={r} />
              ))}
            </div>
          ) : (
            <p className="lead-text mx-auto max-w-xl text-center">{fill(t.emptyText)}</p>
          )}

          {site.social.googleReviews && (
            <div className="mt-14 rounded-3xl bg-surface-2 p-8 text-center sm:p-12">
              <h2 className="text-2xl font-semibold sm:text-3xl">{t.ctaTitle}</h2>
              {t.ctaText && <p className="lead-text mx-auto max-w-xl">{fill(t.ctaText)}</p>}
              <a href={site.social.googleReviews} target="_blank" rel="noopener" className="btn btn-dark mt-6">
                {t.ctaButton}
              </a>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
