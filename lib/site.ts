export const SITE_NAME = "Gemstone Watches";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gemstone-watches.vercel.app";
export const SITE_DESCRIPTION = "Curated luxury watches, authenticated with care and presented with complete, transparent detail.";
export const CONTACT = {
  email: "concierge@gemstonewatches.com",
  phone: "+1 (212) 555-0188",
  whatsapp: "237659178587",
  address: "Douala, Littoral, Cameroun",
};

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${CONTACT.whatsapp}`,
  instagram: "https://instagram.com/gemstonewatches",
  facebook: "https://facebook.com/gemstonewatches",
  tiktok: "https://tiktok.com/@gemstonewatches",
  twitter: "https://x.com/gemstonewatches",
};

export const getWhatsAppLink = (message?: string) => `${SOCIAL_LINKS.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
