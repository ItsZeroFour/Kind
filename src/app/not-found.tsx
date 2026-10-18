import Link from "next/link";
import { PhoneLink, PhoneNumber } from "@/components/ui/PhoneLink";
import { SiteChrome } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="section">
        <div className="container-x max-w-2xl text-center">
          <p className="font-display text-8xl font-bold text-line">404</p>
          <h1 className="mt-4 text-4xl font-bold">This page needs a repair</h1>
          <p className="lead-text mx-auto">The page you&apos;re looking for doesn&apos;t exist or has moved. Your appliance, however, we can fix.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-dark">
              Back to home
            </Link>
            <PhoneLink location="404" className="btn btn-primary">
              <span>
                Call <PhoneNumber />
              </span>
            </PhoneLink>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
