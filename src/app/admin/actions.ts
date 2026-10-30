"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSectionDef, validateSection, type FieldErrors, type SectionKey } from "@/content/model";
import { getRevision, listRevisions, resetSection, saveSection } from "@/content/store";
import {
  checkPassword,
  countUsers,
  createUser,
  deleteUser,
  isStrongEnough,
  login,
  logout,
  passwordRule,
  requireUser,
  setPassword,
} from "@/lib/auth";
import { deleteMedia, listMedia } from "@/lib/media";
import { deleteLead, getLead, isLeadStatus, updateLead, type LeadStatus } from "@/lib/lead-store";
import { resendToCrm } from "@/lib/crm";

export type SaveResult = { ok: true; savedAt: string } | { ok: false; error: string; errors?: FieldErrors };

function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

export async function saveSectionAction(key: string, value: unknown): Promise<SaveResult> {
  const user = await requireUser();
  const def = getSectionDef(key);
  if (!def) return { ok: false, error: "Unknown section" };
  const { value: clean, errors } = validateSection(def, value);
  if (Object.keys(errors).length) return { ok: false, error: "Check the highlighted fields", errors };
  saveSection(def.key, clean, user.id);
  refreshSite();
  return { ok: true, savedAt: new Date().toISOString() };
}

export async function resetSectionAction(key: string): Promise<SaveResult> {
  await requireUser();
  const def = getSectionDef(key);
  if (!def) return { ok: false, error: "Unknown section" };
  resetSection(def.key);
  refreshSite();
  return { ok: true, savedAt: new Date().toISOString() };
}

export async function listRevisionsAction(key: string) {
  await requireUser();
  const def = getSectionDef(key);
  return def ? listRevisions(def.key) : [];
}

export async function getRevisionAction(key: string, id: number) {
  await requireUser();
  const def = getSectionDef(key);
  return def ? getRevision(def.key as SectionKey, Number(id)) : undefined;
}

export async function listMediaAction() {
  await requireUser();
  return listMedia();
}

export async function deleteMediaAction(id: number) {
  await requireUser();
  const res = await deleteMedia(Number(id));
  if (res.ok) revalidatePath("/admin/media");
  return res;
}

export type FormState = { error?: string; ok?: string; email?: string } | undefined;

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password", email };
  const res = await login(email, password);
  if (!res.ok) return { error: res.error, email };
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (!checkPassword(user.id, current)) return { error: "The current password is wrong" };
  if (!isStrongEnough(next)) return { error: `The new password is too short. ${passwordRule}` };
  if (next !== String(form.get("repeat") ?? "")) return { error: "The passwords don't match" };
  await setPassword(user.id, next);
  return { ok: "Password changed. Other devices have been signed out." };
}

export async function createUserAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireUser();
  const email = String(form.get("email") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Invalid email" };
  if (!isStrongEnough(password)) return { error: `The password is too short. ${passwordRule}` };
  try {
    createUser(email, name, password);
  } catch {
    return { error: "A user with this email already exists" };
  }
  revalidatePath("/admin/account");
  return { ok: `User ${email} added` };
}

export async function deleteUserAction(rawId: number) {
  const user = await requireUser();
  const id = Number(rawId);
  if (!Number.isInteger(id)) return { ok: false as const, error: "Unknown user" };
  if (id === user.id) return { ok: false as const, error: "You can't delete yourself" };
  if (countUsers() <= 1) return { ok: false as const, error: "At least one user must remain" };
  deleteUser(id);
  revalidatePath("/admin/account");
  return { ok: true as const };
}

export async function updateLeadAction(id: string, patch: { status?: string; note?: string }) {
  const user = await requireUser();
  if (typeof id !== "string" || !patch || typeof patch !== "object") return { ok: false as const, error: "Lead not found" };
  if (patch.status !== undefined && !isLeadStatus(patch.status)) return { ok: false as const, error: "Unknown status" };
  const note = typeof patch.note === "string" ? patch.note.replace(/\r\n/g, "\n").slice(0, 5000) : undefined;
  if (!updateLead(id, { status: patch.status as LeadStatus | undefined, note }, user.id)) return { ok: false as const, error: "Lead not found" };
  revalidatePath("/admin", "layout");
  return { ok: true as const };
}

export async function resendLeadToCrmAction(id: string) {
  await requireUser();
  const lead = typeof id === "string" ? getLead(id) : null;
  if (!lead) return { ok: false as const, error: "Lead not found" };
  if (lead.crm === "delivered" || lead.crm === "pending") return { ok: false as const, error: "Already delivered or being retried" };
  const sent = await resendToCrm(id, lead.lead);
  revalidatePath("/admin", "layout");
  if (sent) return { ok: true as const };
  const error = getLead(id)?.crmDetail.error;
  return { ok: false as const, error: `${error ? `${error}. ` : ""}Trying again every 5 minutes for 24 hours` };
}

export async function deleteLeadAction(id: string) {
  await requireUser();
  if (typeof id === "string") deleteLead(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}
