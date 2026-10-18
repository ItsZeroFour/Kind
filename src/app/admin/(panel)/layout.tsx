import { requireUser } from "@/lib/auth";
import { getPublicSite } from "@/content/store";
import { countNewLeads } from "@/lib/lead-store";
import { AdminNav } from "../_components/AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const site = getPublicSite();
  return (
    <>
      <AdminNav email={user.email} siteName={site.name} logo={site.logo.image} newLeads={countNewLeads()} />
      <div className="lg:pl-[260px]">
        <main className="mx-auto max-w-[980px] px-4 pt-6 pb-10 sm:px-8 sm:pt-10">{children}</main>
      </div>
    </>
  );
}
