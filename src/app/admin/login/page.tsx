import { redirect } from "next/navigation";
import { countUsers, getUser } from "@/lib/auth";
import { getPublicSite } from "@/content/store";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getUser()) redirect("/admin");
  const site = getPublicSite();
  const noUsers = countUsers() === 0;
  return (
    <div className="on-brand relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -top-[140px] -right-[140px] size-[460px] rounded-full bg-brand-2 opacity-55" aria-hidden />
      <div className="relative w-full max-w-[400px]">
        <div className="mb-6 flex items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo.image} alt="" className="size-12 rounded-full bg-white object-contain" />
          <div className="leading-tight">
            <p className="font-display text-xl font-bold text-white">{site.name}</p>
            <p className="text-[0.75rem] font-semibold tracking-[0.16em] text-peach uppercase">Admin</p>
          </div>
        </div>
        <div className="card-raised !p-6 sm:!p-8">
          <h1 className="text-[1.5rem]">Sign in</h1>
          {noUsers ? (
            <div className="mt-4 rounded-[12px] border border-line bg-surface-2 p-4 text-[0.9rem]">
              <p className="font-bold">No users yet</p>
              <p className="mt-1 text-muted">Create an admin on the server with:</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-brand p-3 font-mono text-[0.8rem] text-on-brand">npm run admin:user</pre>
              <p className="mt-2 text-muted">
                Or set <code className="font-mono">ADMIN_EMAIL</code> and <code className="font-mono">ADMIN_PASSWORD</code> in
                the environment and restart the site.
              </p>
            </div>
          ) : (
            <LoginForm next={(await searchParams).next ?? ""} />
          )}
        </div>
        <p className="mt-5 text-center text-[0.85rem]">
          <a href="/" className="text-on-brand-muted hover:text-white">
            ← Back to the website
          </a>
        </p>
      </div>
    </div>
  );
}
