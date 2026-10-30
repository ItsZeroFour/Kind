import { getContent } from "@/content/store";
import { editableMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const generateMetadata = () => editableMetadata("privacy", "/privacy-policy");

export default function PrivacyPage() {
  const t = getContent().pages.privacy;
  // The SMS section (required for SMS registration) goes before “Contact us”, or last.
  const contact = t.blocks.findIndex((b) => /^contact/i.test(b.title));
  const at = contact === -1 ? t.blocks.length : contact;
  const blocks = [...t.blocks.slice(0, at), t.sms, ...t.blocks.slice(at)];
  return <LegalPage heading={t.heading} path="/privacy-policy" updated={t.updated} blocks={blocks} />;
}
