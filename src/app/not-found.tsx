import Link from "next/link";
import { EnquiryTrigger } from "@/components/enquiry/EnquiryTrigger";

export default function NotFound() {
  return (
    <section className="section-wrap section-space" aria-labelledby="nf-title">
      <p className="kicker">Page not found</p>
      <h1 id="nf-title" style={{ fontSize: "clamp(40px, 5vw, 60px)", letterSpacing: "-2px" }}>
        This page has
        <br />
        <em>moved on.</em>
      </h1>
      <p className="lead" style={{ margin: "22px 0 30px" }}>
        The page you were looking for is not here. Everything else is a step away.
      </p>
      <div className="cta-row">
        <Link prefetch={false} className="button" href="/">
          Back to the homepage <span aria-hidden="true">↗</span>
        </Link>
        <EnquiryTrigger className="text-link" source="not-found">
          Enquire instead <span aria-hidden="true">↗</span>
        </EnquiryTrigger>
      </div>
    </section>
  );
}
