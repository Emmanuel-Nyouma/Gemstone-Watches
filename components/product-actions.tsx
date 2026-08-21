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
  const message = encodeURIComponent(`Bonjour Gemstone Watches, je suis intéressé(e) par la ${title} (réf. ${reference}).`);

  return (
    <>
      <div className="product-cta-stack">
        <a className="button button-gold" href={`https://wa.me/${CONTACT.whatsapp}?text=${message}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Contacter via WhatsApp</a>
        <button className="button button-outline" onClick={share}>{copied ? <Check size={17} /> : <Share2 size={17} />}{copied ? "Lien copié" : "Partager cette montre"}</button>
      </div>
      <details className="inquiry-panel" open>
        <summary>Faire une demande <span>+</span></summary>
        {sent ? <div className="inquiry-success" role="status"><Check /><h3>Demande reçue.</h3><p>Un spécialiste vous répondra sous un jour ouvré.</p></div> : (
          <form onSubmit={submit}>
            <label>Nom complet<input name="name" autoComplete="name" required /></label>
            <label>Adresse e-mail<input type="email" name="email" autoComplete="email" required /></label>
            <label>Téléphone <span>(facultatif)</span><input type="tel" name="phone" autoComplete="tel" /></label>
            <label>Message<textarea name="message" defaultValue={`Je souhaite en savoir plus sur ${title}, référence ${reference}.`} rows={4} required /></label>
            <button className="button button-dark" type="submit">Envoyer la demande</button>
            <small>Vos coordonnées servent uniquement à répondre à votre demande.</small>
          </form>
        )}
      </details>
    </>
  );
}
