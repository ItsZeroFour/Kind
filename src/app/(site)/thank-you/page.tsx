import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getSite } from "@/content/store";
import { pageMetadata } from "@/lib/seo";
import { PhoneLink } from "@/components/ui/PhoneLink";

export const generateMetadata = () =>
  pageMetadata({
  title: "Thank You",
  description: "Your service request has been received.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  const site = getSite();
  return (
    <section className="section section-alt">
      <div className="container-x max-w-2xl text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand text-on-brand">
          <CheckCircle2 className="size-10" aria-hidden />
        </span>
        <h1 className="mt-8 text-4xl font-bold sm:text-5xl">Thanks, we got your request!</h1>
        <p className="lead-text mx-auto">
          A member of our team will call you shortly to confirm your appointment. We usually respond
          within one hour.
        </p>
        <div className="card-raised mt-10 !p-8 text-left">
          <h2 className="text-xl font-bold">While you wait</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
            <li>Find the model and serial number (usually inside the door or on the back) and have it handy.</li>
            <li>For leaks, turn off the water supply to the appliance if it&apos;s safe to do so.</li>
            <li>For a fridge that&apos;s not cooling, keep the doors closed as much as possible.</li>
          </ul>
        </div>
        <p className="mt-10 text-muted">Need help right away?</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <PhoneLink location="thank_you" className="btn btn-cta">
            <span>Call {site.phone.display}</span>
          </PhoneLink>
          <Link href="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
