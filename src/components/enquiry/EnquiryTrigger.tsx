import { asset } from "@/lib/assets";
import type { EnquiryTopic } from "@/content/site";

/**
 * Every "Enquire" action on the site. It is a plain link to the contact page, so it works without
 * script; with script, the enquiry dialog (EnquiryDialog) catches the click and opens in place,
 * with the service already chosen. `source` names the placement for analytics, never the person.
 */
export function EnquiryTrigger({
  topic,
  source,
  className = "button",
  primary = false,
  children,
}: {
  topic?: EnquiryTopic;
  source: string;
  className?: string;
  /** The page's first-screen action. The phone bar stays out of sight while this is on screen. */
  primary?: boolean;
  children: React.ReactNode;
}) {
  const query = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  return (
    <a
      href={asset(`/contact/${query}`)}
      className={className}
      data-enquiry=""
      data-topic={topic}
      data-source={source}
      aria-haspopup="dialog"
      data-primary-cta={primary ? "" : undefined}
    >
      {children}
    </a>
  );
}
