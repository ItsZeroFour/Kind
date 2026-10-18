import { listUsers, passwordRule, requireUser } from "@/lib/auth";
import { PageHead } from "../../_components/PageHead";
import { AddUserForm, DeleteUserButton, PasswordForm } from "./forms";

export const metadata = { title: "Account & users" };

const fmt = (s: string) => new Date(s.replace(" ", "T") + "Z").toLocaleDateString("en-US", { dateStyle: "medium" });

export default async function AccountPage() {
  const me = await requireUser();
  const users = listUsers();
  return (
    <>
      <PageHead title="Account & users" description="Change your password and give other people access. Every user can edit the whole site." />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section className="card !p-5 sm:!p-7">
          <h2 className="text-[1.2rem]">Change password</h2>
          <p className="mt-1 text-[0.9rem] text-muted">{passwordRule}. Other devices are signed out after the change.</p>
          <PasswordForm />
        </section>

        <section className="card !p-5 sm:!p-7">
          <h2 className="text-[1.2rem]">Users</h2>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-bold text-on-brand uppercase">{u.email.charAt(0)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {u.email}
                    {u.id === me.id && <span className="ml-2 text-[0.8rem] font-normal text-muted">(you)</span>}
                  </span>
                  <span className="block text-[0.8rem] text-muted">
                    {u.name && u.name !== "Admin" ? `${u.name} · ` : ""}since {fmt(u.created_at)}
                  </span>
                </span>
                {u.id !== me.id && <DeleteUserButton id={u.id} email={u.email} />}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-[1.05rem]">Add a user</h3>
          <AddUserForm />
        </section>
      </div>
    </>
  );
}
