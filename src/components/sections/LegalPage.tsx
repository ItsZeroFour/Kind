import { fill, getSite } from "@/content/store";
import { PageHero } from "@/components/sections";

type Block = { title: string; text: string };

/** Privacy Policy and Terms: a heading, “Last updated”, an optional opening paragraph and titled sections. */
export function LegalPage({ heading, path, updated, intro, blocks }: { heading: string; path: string; updated: string; intro?: string; blocks: Block[] }) {
  const site = getSite();
  const title = fill(heading, site);
  const paragraphs = (text: string) =>
    fill(text, site)
      .split(/\n\s*\n/)
      .map((p, j) => <p key={j}>{p}</p>);
  return (
    <>
      <PageHero title={title} crumbs={[{ name: title, path }]} hideCtas />
      <section className="section">
        <div className="container-x prose-kind max-w-3xl [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold">
          <p>Last updated: {updated || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          {intro && paragraphs(intro)}
          {blocks
            .filter((b) => b.title && b.text)
            .map((b, i) => (
              <div key={i}>
                <h2>{fill(b.title, site)}</h2>
                {paragraphs(b.text)}
              </div>
            ))}
        </div>
      </section>
    </>
  );
}
