"use client";

import { FormEvent, useState } from "react";
import { Check, MessageCircle, Share2 } from "lucide-react";
import { CONTACT } from "@/lib/site";

export function ProductActions({ title, reference }: { title: string; reference: string }) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const share = async () => {
    if (navigator.share) await navigator.share({ title, url: window.location.href });
    else { await navigator.clipboard.writeText(window.location.href); setCopied(true); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  const message = encodeURIComponent(`Hello Gemstone Watches, I'm interested in the ${title} (Ref. ${reference}).`);

  return (
    <>
      <div className="product-cta-stack">
        <a className="button button-gold" href={`https://wa.me/${CONTACT.whatsapp}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Contact via WhatsApp</a>
        <button className="button button-outline" onClick={share}>{copied ? <Check size={17} /> : <Share2 size={17} />}{copied ? "Link copied" : "Share this watch"}</button>
      </div>
      <details className="inquiry-panel" open>
        <summary>Make an inquiry <span>+</span></summary>
        {sent ? <div className="inquiry-success" role="status"><Check /><h3>Request received.</h3><p>A watch specialist will reply within one business day.</p></div> : (
          <form onSubmit={submit}>
            <label>Full name<input name="name" autoComplete="name" required /></label>
            <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
            <label>Phone <span>(optional)</span><input type="tel" name="phone" autoComplete="tel" /></label>
            <label>Message<textarea name="message" defaultValue={`I would like to know more about the ${title}, reference ${reference}.`} rows={4} required /></label>
            <button className="button button-dark" type="submit">Send inquiry</button>
            <small>Your details are used only to respond to this request.</small>
          </form>
        )}
      </details>
    </>
  );
}
