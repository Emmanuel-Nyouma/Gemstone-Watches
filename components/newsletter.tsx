"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };
  return (
    <section className="newsletter">
      <div className="shell newsletter-inner">
        <div><p className="eyebrow light">Notes privées</p><h2>Des histoires qui<br />méritent votre temps.</h2></div>
        <div>
          <p>Nouveautés, conseils de collectionneurs et invitations de notre équipe horlogère.</p>
          {submitted ? <p className="form-success" role="status">Bienvenue dans le journal Gemstone.</p> : (
            <form onSubmit={handleSubmit}><label className="sr-only" htmlFor="newsletter-email">Adresse e-mail</label><input id="newsletter-email" type="email" required placeholder="Votre adresse e-mail" /><button type="submit" aria-label="S’inscrire"><ArrowRight /></button></form>
          )}
          <small>En vous inscrivant, vous acceptez notre politique de confidentialité.</small>
        </div>
      </div>
    </section>
  );
}
