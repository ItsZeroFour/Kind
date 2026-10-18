import { requireUser } from "@/lib/auth";
import { listMedia, mediaUsage } from "@/lib/media";
import { PageHead } from "../../_components/PageHead";
import { MediaLibrary } from "./MediaLibrary";

export const metadata = { title: "Media library" };

export default async function MediaPage() {
  await requireUser();
  const items = listMedia().map((m) => ({ ...m, usedIn: mediaUsage(m.url) }));
  return (
    <>
      <PageHead
        title="Media library"
        description="All uploaded images. Photos are rotated, resized to 2400px and saved without location data. To put a photo on the site, use Logo & photos."
      />
      <MediaLibrary initial={items} />
    </>
  );
}
