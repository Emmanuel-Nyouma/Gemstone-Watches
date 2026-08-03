import { FaWhatsapp } from "react-icons/fa";
import { getWhatsAppLink } from "@/lib/site";

const message = "Bonjour Gemstone Watches, je souhaite avoir des informations sur une montre.";

export function WhatsAppWidget() {
  return <a className="whatsapp-widget" href={getWhatsAppLink(message)} target="_blank" rel="noreferrer" aria-label="Contacter Gemstone Watches sur WhatsApp">
    <FaWhatsapp aria-hidden="true" />
    <span>Écrivez-nous sur WhatsApp</span>
  </a>;
}
