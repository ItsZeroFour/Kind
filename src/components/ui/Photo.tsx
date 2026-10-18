import Image from "next/image";

export function Photo({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 480px, 100vw",
  priority = false,
  children,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <figure className={`relative m-0 overflow-hidden bg-brand-2 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden
        >
          <div className="text-center">
            <Image src="/images/logo.png" alt="" width={120} height={120} className="mx-auto size-24 rounded-full opacity-90 sm:size-28" />
            <p className="mt-4 font-display text-4xl font-bold text-white">
              Kind<span className="text-dot">.</span>
            </p>
          </div>
        </div>
      )}
      {children}
    </figure>
  );
}
