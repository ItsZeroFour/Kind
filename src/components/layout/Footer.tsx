import Link from "next/link";
import { getAreas, getPublicSite, getServices, getSite } from "@/content/store";
import { Logo } from "@/components/ui/Logo";
import { PhoneLink } from "@/components/ui/PhoneLink";

const company = [
  ["/pricing", "Pricing"],
  ["/about", "About"],
  ["/reviews", "Reviews"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
  ["/book", "Book service"],
  ["/privacy-policy", "Privacy"],
];

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2.5 font-sans text-[0.95rem] font-bold text-on-brand">{title}</h2>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

export function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const link = "no-underline hover:text-white";
  return (
    <footer className="on-brand pt-12 pb-24 text-[0.93rem] text-on-brand-muted md:pb-6">
      <div className="container-x">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo logo={getPublicSite().logo} name={site.name} light />
            {site.footerAbout && <p>{site.footerAbout}</p>}
            <p>
              <PhoneLink location="footer" showIcon={false} className="text-xl font-bold text-white no-underline hover:text-peach" />
              <br />
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
              <br />
              Based in {site.address.city}, {site.address.region}
            </p>
            <p>
              {site.hoursDisplay.map((h) => (
                <span key={h.label} className="block">
                  <b className="text-white">{h.label}:</b> {h.value}
                </span>
              ))}
              {site.hoursNote && <span className="block first-letter:uppercase">{site.hoursNote}</span>}
            </p>
          </div>

          <Col title="Services">
            {getServices().map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={link}>
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/residential-appliance-repair" className={link}>
                Residential repair
              </Link>
            </li>
            <li>
              <Link href="/commercial-appliance-repair" className={link}>
                Commercial repair
              </Link>
            </li>
          </Col>

          <Col title="Service areas">
            {getAreas().map((a) => (
              <li key={a.slug}>
                <Link href={`/service-areas/${a.slug}`} className={link}>
                  {a.city}
                </Link>
              </li>
            ))}
          </Col>

          <Col title="Company">
            {company.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </Col>
        </div>

        <div className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-4 text-[0.8rem]">
          <span>
            © {year} {site.name} · {site.legalName}
            {site.ccbNumber && ` · Oregon CCB #${site.ccbNumber}`}
          </span>
          <span>Brand names are trademarks of their owners. We are an independent repair service, not affiliated with any manufacturer.</span>
        </div>
      </div>
    </footer>
  );
}
