import Link from "next/link";

export function SectionHeading({ eyebrow, title, copy, link, linkLabel = "View all" }: { eyebrow: string; title: string; copy?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div>
      {link && <Link className="text-link" href={link}>{linkLabel} <span>→</span></Link>}
    </div>
  );
}
