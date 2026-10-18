import { fill, getContent, getSite } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections";

export const generateMetadata = () => editableMetadata("privacy", "/privacy-policy");

export default function PrivacyPage() {
  const site = getSite();
  const t = getContent().pages.privacy;
  const heading = fill(t.heading, site);
  return (
    <>
      <PageHero title={heading} crumbs={[{ name: heading, path: "/privacy-policy" }]} hideCtas />
      <section className="section">
        <div className="container-x prose-kind max-w-3xl [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold">
          <p>Last updated: {t.updated || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          {t.blocks.map((b, i) => (
            <div key={i}>
              <h2>{fill(b.title, site)}</h2>
              {fill(b.text, site)
                .split(/\n\s*\n/)
                .map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
