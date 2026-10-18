import { Clock, Mail, MapPin } from "lucide-react";
import { fill, getAreas, getContent, getSite } from "@/content/store";
import { PhoneLink } from "@/components/ui/PhoneLink";

export function ContactAside({ location }: { location: string }) {
  const site = getSite();
  const t = getContent().blocks.contactAside;
  const cities = getAreas().map((a) => a.city);
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
      <div className="on-brand rounded-[18px] p-6 sm:p-7">
        <p className="font-display text-lg font-bold">{t.phoneTitle}</p>
        <PhoneLink location={location} className="mt-2 inline-flex items-center gap-2 font-display text-[1.9rem] font-bold text-peach no-underline hover:text-white" />
        <p className="mt-2 text-on-brand-muted">
          {site.hoursShort}
          {site.hoursNote && `. ${site.hoursNote.charAt(0).toUpperCase()}${site.hoursNote.slice(1)}`}.
        </p>
      </div>

      {t.next.length > 0 && (
        <div className="card !p-6">
          <p className="font-display text-lg font-bold">{t.nextTitle}</p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {t.next.map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-cta text-sm font-bold text-on-cta">{i + 1}</span>
                {fill(step, site)}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="card !p-6">
        <ul className="flex flex-col gap-4">
          <li className="flex gap-3.5">
            <Clock className="mt-0.5 size-5 shrink-0 text-cta" aria-hidden />
            <div>
              <p className="font-bold">{t.hoursTitle}</p>
              {site.hoursDisplay.map((h) => (
                <p key={h.label} className="text-muted">
                  {h.label}: {h.value}
                </p>
              ))}
            </div>
          </li>
          <li className="flex gap-3.5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-cta" aria-hidden />
            <div>
              <p className="font-bold">{t.areaTitle}</p>
              <p className="text-muted">{cities.length > 1 ? `${cities.slice(0, -1).join(", ")} & ${cities.at(-1)}` : cities[0]}</p>
            </div>
          </li>
          <li className="flex gap-3.5">
            <Mail className="mt-0.5 size-5 shrink-0 text-cta" aria-hidden />
            <div>
              <p className="font-bold">{t.emailTitle}</p>
              <a href={`mailto:${site.email}`} className="break-all text-muted hover:text-ink">
                {site.email}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
}
