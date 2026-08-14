export const SITE_NAME = "Gemstone Watches";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gemstone-watches.vercel.app";
export const SITE_DESCRIPTION = "Curated luxury watches, authenticated with care and presented with complete, transparent detail.";
export const CONTACT = {
  email: "njeemmanuelulrich@gmail.com",
  phone: "+237 659 178 587",
  whatsapp: "237659178587",
  address: "Akwa Nord, Douala, Cameroun",
  deliveryHours: "Lundi à samedi : 10h–17h · Dimanche : 10h–13h",
  paymentMethods: ["Orange Money", "MTN Mobile Money"],
};

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${CONTACT.whatsapp}`,
  instagram: "https://www.instagram.com/gemstone._g/",
  facebook: undefined,
  tiktok: "https://www.tiktok.com/@gemstone_watches",
  twitter: undefined,
};

export const getWhatsAppLink = (message?: string) => `${SOCIAL_LINKS.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
