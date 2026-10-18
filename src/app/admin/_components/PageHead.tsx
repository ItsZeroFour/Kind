import { ExternalLink } from "lucide-react";

export function PageHead({ title, description, preview }: { title: string; description?: string; preview?: string }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 max-w-[62ch]">
        <h1 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{title}</h1>
        {description && <p className="mt-1.5 text-muted">{description}</p>}
      </div>
      {preview && (
        <a href={preview} target="_blank" rel="noopener" className="btn btn-ghost btn-sm shrink-0">
          <ExternalLink aria-hidden /> View on site
        </a>
      )}
    </header>
  );
}
