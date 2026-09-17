export type BridalLook = {
  id: string;
  category: string;
  artist: string;
  event: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  palette: string[];
  details: { label: string; value: string }[];
  frames: string[];
  poster: string;
};

export type BridalPackage = {
  id: string;
  name: string;
  startingPrice: number;
  priceLabel: string;
  eyebrow: string;
  idealFor: string;
  description: string;
  inclusions: string[];
  media: string;
  featured?: boolean;
};

export const BRIDAL_SEASONS = [
  { label: "Nov – Dec 2026", status: "A few dates left" },
  { label: "15 Jan – 14 Mar 2027", status: "Booking now" },
] as const;

export const BRIDAL_TRUST = {
  rating: "4.9/5",
  reviewCount: "147 reviews",
  reviewSource: "WedMeGood",
  reviewUrl:
    "https://www.wedmegood.com/profile/Kaya-Planet-Beauty-Salon-636906/reviews",
  instagramUrl:
    "https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTMyNDAzMjUxMDY3NDc1",
  experience: "10+ years in Kanpur",
} as const;

export const BRIDAL_CORE_INCLUSIONS = [
  "Bridal makeup",
  "Hairstyling",
  "Draping",
  "False lashes",
] as const;

export const BRIDAL_LOOKS: BridalLook[] = [
  {
    id: "soft-radiance",
    category: "Natural & luminous",
    artist: "Kaya Planet bridal team",
    event: "Wedding day",
    eyebrow: "Quiet luminosity",
    title: "Soft Radiance",
    subtitle: "Skin that looks like skin. Details that reveal themselves slowly.",
    description:
      "A restrained bridal direction for the bride who wants to feel recognisably herself—polished, luminous and beautifully present.",
    palette: ["Rose", "Champagne", "Pearl"],
    details: [
      { label: "Finish", value: "Soft-focus luminosity" },
      { label: "Mood", value: "Romantic and effortless" },
      { label: "Designed for", value: "Daylight and intimate ceremonies" },
    ],
    frames: [
      "/gallery/bride_aish_1.webp",
      "/gallery/bride_aish_2.webp",
      "/gallery/bride_aish_3.webp",
    ],
    poster: "/gallery/bride_aish_1.webp",
  },
  {
    id: "royal-heritage",
    category: "Traditional & defined",
    artist: "Kaya Planet bridal team",
    event: "Wedding day",
    eyebrow: "Ceremony in every detail",
    title: "Royal Heritage",
    subtitle: "A regal composition of defined eyes, heirloom tones and kundan.",
    description:
      "A richly detailed direction that honours traditional bridal codes while keeping the complexion dimensional and camera-ready.",
    palette: ["Sindoor", "Kundan", "Antique gold"],
    details: [
      { label: "Finish", value: "Sculpted and enduring" },
      { label: "Mood", value: "Regal and ceremonial" },
      { label: "Designed for", value: "Pheras and grand wedding evenings" },
    ],
    frames: [
      "/gallery/bride_raadhya_1.webp",
      "/gallery/bride_raadhya_2.webp",
      "/gallery/bride_raadhya_3.webp",
    ],
    poster: "/gallery/bride_raadhya_1.webp",
  },
  {
    id: "modern-muse",
    category: "Modern & polished",
    artist: "Kaya Planet bridal team",
    event: "Engagement or reception",
    eyebrow: "A new kind of classic",
    title: "Modern Muse",
    subtitle: "Clean structure, contemporary colour and a confident final gaze.",
    description:
      "For the bride who edits tradition through her own point of view—refined, modern and made to move from portraits to celebration.",
    palette: ["Ivory", "Cocoa", "Burnished gold"],
    details: [
      { label: "Finish", value: "Refined definition" },
      { label: "Mood", value: "Contemporary and assured" },
      { label: "Designed for", value: "Engagements and receptions" },
    ],
    frames: [
      "/gallery/bride_saumya_1.webp",
      "/gallery/bride_saumya_2.webp",
      "/gallery/bride_saumya_3.webp",
    ],
    poster: "/gallery/bride_saumya_1.webp",
  },
];

export const BRIDAL_PACKAGES: BridalPackage[] = [
  {
    id: "mac",
    name: "MAC",
    startingPrice: 14000,
    priceLabel: "₹14,000",
    eyebrow: "The classic",
    idealFor: "A polished bridal finish with a MAC-led kit",
    description:
      "A considered starting point for brides who want professional artistry and a clean, timeless result.",
    inclusions: ["MAC-led professional makeup"],
    media: "/gallery/bride_collection_1.webp",
  },
  {
    id: "hd",
    name: "HD",
    startingPrice: 24000,
    priceLabel: "₹24,000",
    eyebrow: "Camera considered",
    idealFor: "Close-up photography and high-definition coverage",
    description:
      "A refined finish planned for the way modern wedding cameras capture complexion and detail.",
    inclusions: ["High-definition complexion finish"],
    media: "/gallery/bride_collection_2.webp",
  },
  {
    id: "signature-airbrush",
    name: "Signature / Airbrush",
    startingPrice: 28000,
    priceLabel: "₹28,000",
    eyebrow: "The atelier signature",
    idealFor: "A customised signature or airbrush direction",
    description:
      "A more tailored look direction developed around your features, references and celebration.",
    inclusions: ["Signature or airbrush finish"],
    media: "/gallery/bride_collection_3.webp",
  },
  {
    id: "royal-signature",
    name: "Royal Signature",
    startingPrice: 32000,
    priceLabel: "₹32,000",
    eyebrow: "Elevated detail",
    idealFor: "Brides seeking a more elaborate, detail-led composition",
    description:
      "An elevated bridal direction where finishing, styling and every visible detail are given added focus.",
    inclusions: ["Elevated detailing and finishing"],
    media: "/gallery/bride_collection_4.webp",
  },
  {
    id: "royal-bride",
    name: "KP’s Royal Bride",
    startingPrice: 42000,
    priceLabel: "₹42,000",
    eyebrow: "The complete ritual",
    idealFor: "A complete bridal experience with signature additions",
    description:
      "Kaya Planet’s most complete named bridal tier, created for a bride who wants the details held together in one experience.",
    inclusions: [
      "Kundan jewellery on rent",
      "Nail extensions",
      "Human-hair lashes",
    ],
    media: "/gallery/bride_collection_5.webp",
    featured: true,
  },
];

export const BRIDAL_REVIEWS = [
  {
    id: "rashika-gorgeous",
    videoUrl: "/videos/review-reel-1.mp4",
    posterUrl: "/videos/review-reel-1-poster.webp",
    videoLabel: "Engagement makeup work",
    quote:
      "Everyone kept complimenting the makeup — honestly magic.",
    artist: "Makeup by Rashika",
    source: "Client review",
    sourceUrl: "https://www.instagram.com/reel/DSP27QDk5uP/",
  },
  {
    id: "bride-faith",
    videoUrl: "/videos/review-reel-2.mp4",
    posterUrl: "/videos/review-reel-2-poster.webp",
    videoLabel: "Bridal makeup work",
    quote:
      "I came with all the faith that you would do a fabulous job — and you actually did.",
    artist: "Kaya Planet bride",
    source: "Client review",
    sourceUrl: "https://www.instagram.com/kayaplanetbeautysalon/",
  },
  {
    id: "bhawna-team",
    videoUrl: "/videos/reel4.mp4",
    posterUrl: "/videos/reel4-poster.webp",
    videoLabel: "HD bridal work",
    quote:
      "Bhawna ma’am did my makeup. I highly recommend KP for your D-day.",
    artist: "Bridal makeup by Bhawna",
    source: "WedMeGood bride",
    sourceUrl:
      "https://www.wedmegood.com/profile/Kaya-Planet-Beauty-Salon-636906/reviews",
  },
] as const;

export const BRIDAL_PROCESS = [
  {
    step: "01",
    title: "Check your date",
    description:
      "Send your function, date and venue on WhatsApp. We confirm availability and the most suitable package.",
  },
  {
    step: "02",
    title: "Plan your look",
    description:
      "Share your outfit, jewellery and references. A paid trial is available before the wedding.",
  },
  {
    step: "03",
    title: "Confirm in writing",
    description:
      "Your artist, inclusions, timing, venue plan and advance are confirmed before the date is blocked.",
  },
  {
    step: "04",
    title: "Get ready calmly",
    description:
      "The team completes makeup, hair and draping around your photography and ceremony schedule.",
  },
] as const;

export const BRIDAL_FAQS = [
  {
    question: "How far in advance should I book my bridal date?",
    answer:
      "Most brides book around three months before the wedding, while popular November and February dates can fill four months ahead. An advance confirms the date.",
  },
  {
    question: "Can I book a pre-wedding trial?",
    answer:
      "Yes. Kaya Planet offers a paid trial so you can experience the finish and refine your wedding look before the day. The trial fee and appointment details are confirmed when you enquire.",
  },
  {
    question: "Do you travel to wedding venues?",
    answer:
      "Yes. Venue bookings are available in Kanpur and for outstation weddings. Travel and accommodation charges apply to outstation bookings.",
  },
  {
    question: "What is included in a bridal package?",
    answer:
      "The core booking covers bridal makeup, hairstyling, draping and false lashes. Finish-specific and Royal Bride additions are listed with each package; your written quote confirms every inclusion.",
  },
  {
    question: "Who will do my bridal makeup?",
    answer:
      "Founder-led packages are created by Bhawna or Rashika. Ask which artist is available for your date; the artist and package are confirmed before you pay the booking advance.",
  },
  {
    question: "How long should I allow for getting ready?",
    answer:
      "Your exact reporting time depends on the chosen look, hair, draping, photography and ceremony schedule. Share your ready-by time on WhatsApp so the team can plan a comfortable start.",
  },
  {
    question: "How do you work with sensitive or acne-prone skin?",
    answer:
      "Tell the team about sensitivities, allergies or active treatments before your trial or appointment. Products and skin preparation are selected for your skin, and tools are cleaned between clients.",
  },
  {
    question: "How is my date confirmed?",
    answer:
      "Availability is checked first and an advance blocks the date. The advance, cancellation and rescheduling terms are shared with your written booking details before payment.",
  },
  {
    question: "Which professional brands do you use?",
    answer:
      "The professional kit includes brands such as MAC, Huda Beauty, NARS and Charlotte Tilbury. Products are selected for your skin and chosen finish rather than using one fixed kit for every bride.",
  },
] as const;
