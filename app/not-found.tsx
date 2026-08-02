import Link from "next/link";

export default function NotFound() { return <section className="not-found shell"><p className="eyebrow">404 · Time waits for no one</p><h1>This page has moved on.</h1><p>The watch or collection you were looking for may no longer be available.</p><div><Link className="button button-dark" href="/shop">Browse watches</Link><Link className="text-link" href="/">Return home →</Link></div></section>; }
