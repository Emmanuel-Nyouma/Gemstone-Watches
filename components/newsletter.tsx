"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return (
    <section className="newsletter">
      <div className="shell newsletter-inner">
        <div><p className="eyebrow light">Private notes</p><h2>Stories worth<br />making time for.</h2></div>
        <div>
          <p>New arrivals, collector guides and invitations from our watch desk—sent with restraint.</p>
          {submitted ? <p className="form-success" role="status">Welcome to the Gemstone journal.</p> : (
            <form onSubmit={handleSubmit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" /><button type="submit" aria-label="Subscribe"><ArrowRight /></button></form>
          )}
          <small>By subscribing, you agree to our privacy policy.</small>
        </div>
      </div>
    </section>
  );
}
