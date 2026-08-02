"use client";

import { FormEvent, useState } from "react";
import { Check } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  if (sent) return <div className="contact-success" role="status"><Check /><p className="eyebrow">Thank you</p><h2>Your message is with our watch desk.</h2><p>We will be in touch within one business day.</p></div>;
  return (
    <form className="contact-form" onSubmit={submit}>
      <div><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label></div>
      <label>Email address<input type="email" name="email" autoComplete="email" required /></label>
      <label>Phone number <span>(optional)</span><input type="tel" name="phone" autoComplete="tel" /></label>
      <label>How can we help?<select name="subject"><option>Find a particular watch</option><option>Discuss a listed watch</option><option>Sell or consign a watch</option><option>After-sales support</option><option>Other</option></select></label>
      <label>Your message<textarea name="message" rows={6} required /></label>
      <label className="consent"><input type="checkbox" required /><span>I agree to Gemstone Watches using my details to respond to this inquiry.</span></label>
      <button className="button button-gold" type="submit">Send message</button>
    </form>
  );
}
