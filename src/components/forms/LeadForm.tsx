"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Box,
  Building2,
  CookingPot,
  Droplets,
  Flame,
  Loader2,
  Lock,
  Microwave,
  Refrigerator,
  Snowflake,
  WashingMachine,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { FieldErrors } from "@/lib/leads";
import { getAttribution, track } from "@/lib/tracking";
import { useSite } from "@/components/providers/SiteProvider";
import { PhoneLink } from "@/components/ui/PhoneLink";

type Props = {
  formId: string;
  variant?: "compact" | "full";
  defaultAppliance?: string;
  defaultCustomerType?: "residential" | "commercial";
  submitLabel?: string;
};

const applianceIcons: Record<string, LucideIcon> = {
  refrigerator: Refrigerator,
  washer: WashingMachine,
  dryer: Wind,
  dishwasher: Droplets,
  oven: CookingPot,
  cooktop: Flame,
  freezer: Snowflake,
  microwave: Microwave,
  icemaker: Box,
  commercial: Building2,
  other: Wrench,
};

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="mb-3 flex items-center gap-2.5 font-display text-lg font-bold text-ink">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-sm text-on-brand">{n}</span>
      {children}
    </legend>
  );
}

const choice =
  "flex h-full cursor-pointer rounded-[12px] border border-line bg-bg transition peer-checked:border-leaf peer-checked:bg-surface-2 peer-checked:shadow-[inset_0_0_0_1px_var(--leaf)] peer-focus-visible:outline-3 peer-focus-visible:outline-dot hover:border-leaf";

export function LeadForm({
  formId,
  variant = "full",
  defaultAppliance = "",
  defaultCustomerType = "residential",
  submitLabel,
}: Props) {
  const site = useSite();
  const f = site.form;
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phone, setPhone] = useState("");
  const [appliance, setAppliance] = useState(defaultAppliance);
  const [customerType, setCustomerType] = useState(defaultCustomerType);
  const started = useRef(false);
  const compact = variant === "compact";
  // Visitor's local date (toISOString is UTC, which is already "tomorrow" on Oregon evenings).
  const [today, setToday] = useState<string>();

  useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("appliance");
    if (q && f.appliances.some((a) => a.name === q)) setAppliance(q);
  }, [f.appliances]);

  function onFirstInteraction() {
    if (started.current) return;
    started.current = true;
    track("form_start", { form_id: formId });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    const payload: Record<string, unknown> = {
      ...Object.fromEntries(new FormData(e.currentTarget)),
      formId,
      pageUrl: window.location.href,
      attribution: getAttribution(),
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrors(json.errors ?? {});
        setStatus("error");
        return;
      }
      track("generate_lead", {
        form_id: formId,
        lead_id: json.id,
        appliance_type: String(payload.applianceType ?? ""),
        customer_type: String(payload.customerType ?? ""),
      });
      router.push(`/thank-you?ref=${encodeURIComponent(formId)}`);
    } catch {
      setStatus("error");
    }
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${formId}-${k}-err`} className="mt-1 text-sm font-semibold text-cta">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof FieldErrors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${formId}-${k}-err` : undefined,
  });
  const id = (k: string) => `${formId}-${k}`;

  const contactFields = (
    <>
      <div>
        <label htmlFor={id("name")} className="field-label">
          Name <span className="text-cta">*</span>
        </label>
        <input id={id("name")} name="name" autoComplete="name" required className="field" placeholder="Jane Smith" {...a11y("name")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor={id("phone")} className="field-label">
          Phone <span className="text-cta">*</span>
        </label>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          className="field"
          placeholder="(503) 000-0000"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          {...a11y("phone")}
        />
        {err("phone")}
      </div>
    </>
  );

  const zipField = (
    <div>
      <label htmlFor={id("zip")} className="field-label">
        ZIP code
      </label>
      <input
        id={id("zip")}
        name="zip"
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        pattern="\d{5}"
        className="field"
        placeholder="97123"
        {...a11y("zip")}
      />
      {err("zip")}
    </div>
  );

  const footer = (
    <>
      {status === "error" && Object.keys(errors).length === 0 && (
        <p role="alert" className="rounded-[10px] bg-surface-2 px-3.5 py-3 text-sm font-semibold">
          Something went wrong sending your request. Please try again or call{" "}
          <PhoneLink location={`form_error_${formId}`} showIcon={false} className="underline" />.
        </p>
      )}

      <button type="submit" className="btn btn-cta w-full" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          <>
            {submitLabel ?? (compact ? f.submitCompact : f.submitFull)} <ArrowRight aria-hidden />
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-[0.8rem] leading-relaxed text-muted">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>
          ${customerType === "commercial" ? site.pricing.commercialServiceCall : site.pricing.serviceCall} service call
          {site.pricing.creditedOnRepair && ", credited toward the repair"}.{f.note && ` ${f.note}`}
          {f.callPrompt && (
            <>
              {" "}
              {f.callPrompt}{" "}
              <a href={site.phone.href} className="font-bold text-ink underline" data-phone="primary">
                {site.phone.display}
              </a>
              .
            </>
          )}
        </span>
      </p>
    </>
  );

  const honeypot = (
    <div className="absolute -left-[9999px]" aria-hidden>
      <label>
        Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );

  if (compact) {
    return (
      <form onSubmit={onSubmit} onFocus={onFirstInteraction} noValidate className="relative flex flex-col gap-3.5" aria-label="Service request form">
        {honeypot}
        <input type="hidden" name="customerType" value={defaultCustomerType} />
        <div className="grid gap-3 min-[420px]:grid-cols-2">
          {contactFields}
          {zipField}
          <div>
            <label htmlFor={id("applianceType")} className="field-label">
              Appliance
            </label>
            <select
              id={id("applianceType")}
              name="applianceType"
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
              className="field"
            >
              <option value="">Choose…</option>
              {f.appliances.map((a) => (
                <option key={a.name}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="min-[420px]:col-span-2">
            <label htmlFor={id("urgency")} className="field-label">
              How urgent?
            </label>
            <select id={id("urgency")} name="urgency" defaultValue="standard" className="field">
              {f.urgency.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {footer}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocus={onFirstInteraction} noValidate className="relative flex flex-col gap-8" aria-label="Book a service appointment">
      {honeypot}

      <fieldset>
        <StepTitle n={1}>{f.stepAppliance}</StepTitle>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {f.appliances.map((a) => {
            const Icon = applianceIcons[a.icon] ?? Wrench;
            return (
              <label key={a.name} className="cursor-pointer">
                <input
                  type="radio"
                  name="applianceType"
                  value={a.name}
                  checked={appliance === a.name}
                  onChange={() => setAppliance(a.name)}
                  className="peer sr-only"
                />
                <span className={`${choice} items-center gap-2.5 px-3 py-3 text-[0.92rem] font-semibold`}>
                  <Icon className="size-5 shrink-0 text-leaf" aria-hidden strokeWidth={1.75} />
                  {a.name}
                </span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={id("brand")} className="field-label">
              Brand <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id={id("brand")} name="brand" className="field" placeholder="e.g. Whirlpool, LG, Bosch" />
          </div>
          <fieldset>
            <legend className="field-label">This is for my…</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["residential", "commercial"] as const).map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="customerType"
                    value={t}
                    defaultChecked={t === defaultCustomerType}
                    onChange={() => setCustomerType(t)}
                    className="peer sr-only"
                  />
                  <span className={`${choice} min-h-12 items-center justify-center px-3 text-[0.95rem] font-semibold`}>
                    {t === "residential" ? "Home" : "Business"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mt-3">
          <label htmlFor={id("problem")} className="field-label">
            What&apos;s going on? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={id("problem")}
            name="problem"
            rows={3}
            className="field resize-y"
            placeholder="Noises, error codes, leaks, when it started…"
          />
        </div>
      </fieldset>

      <fieldset>
        <StepTitle n={2}>{f.stepUrgency}</StepTitle>
        <div className={`grid gap-2 ${f.urgency.length === 3 ? "sm:grid-cols-3" : f.urgency.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {f.urgency.map((u) => (
            <label key={u.value} className="cursor-pointer">
              <input type="radio" name="urgency" value={u.value} defaultChecked={u.value === "standard"} className="peer sr-only" />
              <span className={`${choice} flex-col px-3.5 py-3`}>
                <span className="font-bold">{u.label}</span>
                <span className="text-sm text-muted">{u.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={id("preferredDate")} className="field-label">
              Preferred date
            </label>
            <input id={id("preferredDate")} name="preferredDate" type="date" min={today} className="field" />
          </div>
          <div>
            <label htmlFor={id("preferredTime")} className="field-label">
              Preferred time
            </label>
            <select id={id("preferredTime")} name="preferredTime" defaultValue="" className="field">
              <option value="">Any time</option>
              {f.windows.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <StepTitle n={3}>{f.stepContact}</StepTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {contactFields}
          <div>
            <label htmlFor={id("email")} className="field-label">
              Email <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id={id("email")} name="email" type="email" autoComplete="email" className="field" placeholder="you@email.com" {...a11y("email")} />
            {err("email")}
          </div>
          {zipField}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3.5">{footer}</div>
    </form>
  );
}
