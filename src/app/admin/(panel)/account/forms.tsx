"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { changePasswordAction, createUserAction, deleteUserAction, type FormState } from "../../actions";

function Message({ state }: { state: FormState }) {
  if (!state) return null;
  return state.error ? (
    <p className="rounded-[10px] bg-cta/10 px-3 py-2 text-[0.9rem] font-semibold text-cta" role="alert">
      {state.error}
    </p>
  ) : (
    <p className="rounded-[10px] bg-ok/10 px-3 py-2 text-[0.9rem] font-semibold text-ok" role="status">
      {state.ok}
    </p>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={props.id} className="field-label">
        {label}
      </label>
      <input className="field" required {...props} />
    </div>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="mt-5 flex flex-col gap-4">
      <Input label="Current password" id="current" name="current" type="password" autoComplete="current-password" />
      <Input label="New password" id="next" name="next" type="password" autoComplete="new-password" minLength={10} />
      <Input label="Repeat the new password" id="repeat" name="repeat" type="password" autoComplete="new-password" minLength={10} />
      <Message state={state} />
      <button type="submit" className="btn btn-dark self-start" disabled={pending}>
        {pending && <Loader2 className="animate-spin" aria-hidden />} Change password
      </button>
    </form>
  );
}

export function AddUserForm() {
  const [state, action, pending] = useActionState(createUserAction, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="mt-3 flex flex-col gap-4">
      <Input label="Email" id="new-email" name="email" type="email" autoComplete="off" />
      <Input label="Name (optional)" id="new-name" name="name" required={false} autoComplete="off" />
      <Input label="Password" id="new-password" name="password" type="password" autoComplete="new-password" minLength={10} />
      <Message state={state} />
      <button type="submit" className="btn btn-dark self-start" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <UserPlus aria-hidden />} Add
      </button>
    </form>
  );
}

export function DeleteUserButton({ id, email }: { id: number; email: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <>
      {error && <span className="text-[0.8rem] text-cta">{error}</span>}
      <button
        type="button"
        className="grid size-9 place-items-center rounded-full text-muted hover:bg-cta/10 hover:text-cta"
        title="Delete"
        disabled={pending}
        onClick={() =>
          confirm(`Delete user ${email}?`) &&
          start(async () => {
            const res = await deleteUserAction(id);
            if (!res.ok) setError(res.error);
          })
        }
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
        <span className="sr-only">Delete {email}</span>
      </button>
    </>
  );
}
