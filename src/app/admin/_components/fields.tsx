"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Images, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { getPath, iconNames, parsePhone, setPath, slugify, type Field, type FieldErrors } from "@/content/model";
import { icons } from "@/components/ui/Icon";
import { MediaPicker } from "./MediaPicker";

type Props = {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  path: string;
  errors: FieldErrors;
};

const asString = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

export function FieldInput({ field, value, onChange, path, errors }: Props) {
  const error = errors[path];
  const id = `f-${path.replace(/\W/g, "-")}`;
  const describedBy = [field.help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;

  const label = (
    <label htmlFor={id} className="field-label">
      {field.label}
      {"required" in field && field.required && <span className="text-cta"> *</span>}
    </label>
  );
  const footer = (
    <>
      {field.help && (
        <p id={`${id}-help`} className="mt-1.5 text-[0.8rem] leading-snug text-muted">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.82rem] font-semibold text-cta" role="alert">
          {error}
        </p>
      )}
    </>
  );
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy } as const;

  switch (field.kind) {
    case "text":
    case "email":
    case "url":
      return (
        <div>
          {label}
          <input
            {...common}
            type={field.kind === "text" ? "text" : field.kind}
            className="field"
            value={asString(value)}
            placeholder={"placeholder" in field ? field.placeholder : field.kind === "url" ? "https://" : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
          {footer}
        </div>
      );
    case "phone":
      return (
        <div>
          {label}
          <input
            {...common}
            type="tel"
            className="field max-w-xs"
            value={asString(value)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => {
              const p = parsePhone(e.target.value);
              if (p) onChange(p.display);
            }}
          />
          {footer}
        </div>
      );
    case "textarea": {
      const s = asString(value);
      return (
        <div>
          {label}
          <textarea
            {...common}
            className="field min-h-0 resize-y leading-relaxed"
            rows={field.rows ?? 3}
            value={s}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.max && (
            <p className={`mt-1 text-right text-[0.75rem] ${s.length > field.max ? "font-bold text-cta" : "text-muted"}`}>
              {s.length} / {field.max}
            </p>
          )}
          {footer}
        </div>
      );
    }
    case "number":
      return (
        <div>
          {label}
          <input
            {...common}
            type="number"
            inputMode="decimal"
            className="field max-w-[12rem]"
            min={field.min}
            max={field.max}
            value={typeof value === "number" ? value : asString(value)}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
          {footer}
        </div>
      );
    case "toggle":
      return (
        <div>
          <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
            <input {...common} type="checkbox" className="peer sr-only" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            <span
              className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-leaf peer-focus-visible:outline-3 peer-focus-visible:outline-dot after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
              aria-hidden
            />
            <span className="font-semibold">{field.label}</span>
          </label>
          <div className="pl-14">{footer}</div>
        </div>
      );
    case "image":
      return <ImageField field={field} value={asString(value)} onChange={onChange} id={id} label={label} footer={footer} />;
    case "icon":
      return <IconField value={asString(value)} onChange={onChange} label={field.label} />;
    case "select":
      return (
        <div>
          {label}
          <select {...common} className="field" value={asString(value)} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {footer}
        </div>
      );
    case "slug":
      return (
        <div>
          {label}
          <div className="flex min-h-12 items-stretch overflow-hidden rounded-[10px] border border-line bg-bg focus-within:border-leaf">
            <span className="flex items-center border-r border-line bg-surface-2 px-3 font-mono text-[0.85rem] text-muted">{field.prefix}</span>
            <input
              {...common}
              type="text"
              className="min-w-0 flex-1 bg-transparent px-3 font-mono text-[0.92rem] outline-none"
              value={asString(value)}
              spellCheck={false}
              autoCapitalize="off"
              onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              onBlur={(e) => onChange(slugify(e.target.value))}
            />
          </div>
          {footer}
        </div>
      );
    case "strings":
      return <StringsField field={field} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} path={path} errors={errors} />;
    case "list":
      return (
        <ListField
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
          path={path}
          errors={errors}
        />
      );
  }
}

const shapes = { square: "aspect-square w-36", wide: "aspect-[4/3] w-60", tall: "aspect-[3/4] w-40" };

function ImageField({
  field,
  value,
  onChange,
  id,
  label,
  footer,
}: {
  field: Extract<Field, { kind: "image" }>;
  value: string;
  onChange: (v: unknown) => void;
  id: string;
  label: React.ReactNode;
  footer: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
      onChange(json.item.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      {label}
      <div className="flex flex-wrap items-end gap-4">
        <div
          className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[12px] border border-dashed border-line bg-surface-2 ${shapes[field.shape ?? "wide"]}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) upload(f);
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 px-2 text-center text-[0.78rem] text-muted">
              <ImagePlus className="size-6" aria-hidden />
              No photo
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-surface/70">
              <Loader2 className="size-6 animate-spin text-leaf" aria-label="Loading" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={input}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <button type="button" className="btn btn-dark btn-sm" disabled={busy} onClick={() => input.current?.click()}>
            <Upload aria-hidden /> Upload
          </button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setPicking(true)}>
            <Images aria-hidden /> From library
          </button>
          {value && (
            <button type="button" className="btn btn-sm text-muted hover:text-cta" onClick={() => onChange("")}>
              <X aria-hidden /> Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-[0.82rem] font-semibold text-cta">{error}</p>}
      {footer}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

function IconField({ value, onChange, label }: { value: string; onChange: (v: unknown) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const Current = icons[value as keyof typeof icons] ?? icons.check;
  return (
    <div className="relative">
      <span className="field-label">{label}</span>
      <button
        type="button"
        className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line bg-bg px-3 hover:border-leaf"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tile-ic !size-8">
          <Current aria-hidden />
        </span>
        <ChevronDown className="size-4 text-muted" aria-hidden />
        <span className="sr-only">Choose icon</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-30 mt-1 grid w-[17rem] grid-cols-5 gap-1.5 rounded-[12px] border border-line bg-surface p-2 shadow-soft">
          {iconNames.map((name) => {
            const C = icons[name];
            return (
              <button
                key={name}
                type="button"
                title={name}
                className={`grid size-11 place-items-center rounded-[10px] border transition hover:border-leaf ${name === value ? "border-leaf bg-surface-2 text-leaf" : "border-transparent"}`}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <C className="size-5" aria-hidden />
                <span className="sr-only">{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number) {
  const out = [...arr];
  const [x] = out.splice(from, 1);
  out.splice(to, 0, x);
  return out;
}

function RowTools({ i, n, onMove, onRemove, what }: { i: number; n: number; onMove: (to: number) => void; onRemove: () => void; what: string }) {
  const b = "grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-ink disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={b} disabled={i === 0} onClick={() => onMove(i - 1)} title="Up">
        <ArrowUp className="size-4" aria-hidden />
        <span className="sr-only">Move up</span>
      </button>
      <button type="button" className={b} disabled={i === n - 1} onClick={() => onMove(i + 1)} title="Down">
        <ArrowDown className="size-4" aria-hidden />
        <span className="sr-only">Move down</span>
      </button>
      <button type="button" className={`${b} hover:!text-cta`} onClick={onRemove} title="Delete">
        <Trash2 className="size-4" aria-hidden />
        <span className="sr-only">Delete {what}</span>
      </button>
    </div>
  );
}

function StringsField({
  field,
  value,
  onChange,
  path,
  errors,
}: {
  field: Extract<Field, { kind: "strings" }>;
  value: string[];
  onChange: (v: unknown) => void;
  path: string;
  errors: FieldErrors;
}) {
  const max = field.max ?? 50;
  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{field.label}</legend>
      <ol className="flex flex-col gap-2">
        {value.map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-3 w-5 shrink-0 text-right text-sm font-bold text-muted">{i + 1}</span>
            <textarea
              className="field min-h-0 flex-1 resize-y leading-relaxed"
              rows={s.length > 120 ? 4 : 2}
              value={s}
              aria-label={`${field.label}, ${i + 1}`}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <RowTools
              i={i}
              n={value.length}
              what={field.itemLabel ?? "line"}
              onMove={(to) => onChange(move(value, i, to))}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
            />
          </li>
        ))}
      </ol>
      {errors[path] && <p className="mt-1.5 text-[0.82rem] font-semibold text-cta">{errors[path]}</p>}
      {value.length < max && (
        <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => onChange([...value, ""])}>
          <Plus aria-hidden /> Add {field.itemLabel ?? "line"}
        </button>
      )}
      {field.help && <p className="mt-1.5 text-[0.8rem] text-muted">{field.help}</p>}
    </fieldset>
  );
}

function emptyItem(fields: Field[]) {
  let o: Record<string, unknown> = {};
  for (const f of fields) {
    const v =
      f.kind === "icon"
        ? iconNames[0]
        : f.kind === "select"
          ? f.options[0].value
          : f.kind === "toggle"
            ? false
            : f.kind === "number"
              ? (f.max ?? f.min ?? 0)
              : f.kind === "list" || f.kind === "strings"
                ? []
                : "";
    o = setPath(o, f.key, v);
  }
  return o;
}

function withSlug(field: Extract<Field, { kind: "list" }>, item: Record<string, unknown>, key: string, v: unknown) {
  const next = setPath(item, key, v);
  const slugKey = field.item.find((f) => f.kind === "slug")?.key;
  if (!slugKey || key !== field.titleKey) return next;
  const slug = asString(getPath(item, slugKey));
  return slug === "" || slug === slugify(asString(getPath(item, key))) ? setPath(next, slugKey, slugify(asString(v))) : next;
}

function ListField({
  field,
  value,
  onChange,
  path,
  errors,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Record<string, unknown>[];
  onChange: (v: unknown) => void;
  path: string;
  errors: FieldErrors;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const max = field.max ?? 50;
  const hasErrors = (i: number) => Object.keys(errors).some((k) => k.startsWith(`${path}.${i}.`));
  return (
    <fieldset className="min-w-0">
      <legend className="field-label">{field.label}</legend>
      <ol className="flex flex-col gap-2">
        {value.map((item, i) => {
          const expanded = open === i || hasErrors(i);
          const title = asString(getPath(item, field.titleKey)) || `Untitled`;
          const iconName = asString(getPath(item, "icon"));
          const ItemIcon = iconName ? icons[iconName as keyof typeof icons] : null;
          return (
            <li key={i} className={`rounded-[12px] border bg-surface ${hasErrors(i) ? "border-cta" : "border-line"}`}>
              <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3">
                <button
                  type="button"
                  className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 text-left"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-[0.75rem] font-bold text-muted">{i + 1}</span>
                  {ItemIcon && <ItemIcon className="size-4 shrink-0 text-leaf" aria-hidden />}
                  <span className="truncate font-semibold">{title}</span>
                  <ChevronDown className={`ml-auto size-4 shrink-0 text-muted transition ${expanded ? "rotate-180" : ""}`} aria-hidden />
                </button>
                <RowTools
                  i={i}
                  n={value.length}
                  what={field.itemLabel}
                  onMove={(to) => {
                    onChange(move(value, i, to));
                    setOpen(to);
                  }}
                  onRemove={() => {
                    if (confirm(`Delete the ${field.itemLabel} “${title}”?`)) onChange(value.filter((_, j) => j !== i));
                  }}
                />
              </div>
              {expanded && (
                <div className="grid gap-4 border-t border-line p-4 sm:grid-cols-[auto_1fr]">
                  {field.item.map((sub, k) => (
                    <div key={sub.key} className={sub.kind === "icon" || field.item[k - 1]?.kind === "icon" ? "min-w-0" : "min-w-0 sm:col-span-2"}>
                      <FieldInput
                        field={sub}
                        value={getPath(item, sub.key)}
                        path={`${path}.${i}.${sub.key}`}
                        errors={errors}
                        onChange={(v) => onChange(value.map((it, j) => (j === i ? withSlug(field, it, sub.key, v) : it)))}
                      />
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {value.length < max && (
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-3"
          onClick={() => {
            onChange([...value, emptyItem(field.item)]);
            setOpen(value.length);
          }}
        >
          <Plus aria-hidden /> Add {field.itemLabel}
        </button>
      )}
      {field.help && <p className="mt-1.5 text-[0.8rem] text-muted">{field.help}</p>}
    </fieldset>
  );
}
