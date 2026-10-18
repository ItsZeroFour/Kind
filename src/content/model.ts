import { defaultAreas } from "./areas";
import { defaultFaqs } from "./faqs";
import { defaultReviews } from "./reviews";
import { defaultBrands, defaultServices } from "./services";
import { defaultPriceCategories } from "./prices";

export const iconNames = [
  "calendar", "message", "truck", "search", "wrench", "badge", "dollar", "paw", "clock", "tag",
  "camera", "hammer", "shield", "star", "home", "building", "phone", "check", "heart", "sparkles",
] as const;
export type IconName = (typeof iconNames)[number];

type Base = { key: string; label: string; help?: string };
export type Option = { value: string; label: string };
export type Field =
  | (Base & { kind: "text"; placeholder?: string; max?: number; required?: boolean; pattern?: string; patternError?: string })
  | (Base & { kind: "textarea"; rows?: number; max?: number; required?: boolean })
  | (Base & { kind: "number"; min?: number; max?: number })
  | (Base & { kind: "toggle" })
  | (Base & { kind: "phone" })
  | (Base & { kind: "email" })
  | (Base & { kind: "url"; placeholder?: string })
  | (Base & { kind: "image"; shape?: "square" | "wide" | "tall" })
  | (Base & { kind: "icon" })
  | (Base & { kind: "select"; options: Option[] })
  | (Base & { kind: "slug"; prefix: string })
  | (Base & { kind: "strings"; max?: number; itemLabel?: string })
  | (Base & { kind: "list"; item: Field[]; titleKey: string; itemLabel: string; max?: number; unique?: string });

export type Group = { title: string; description?: string; fields: Field[] };
export type SectionDef = { key: SectionKey; title: string; description: string; groups: Group[] };

export const placeholdersHelp = "Placeholders: {company}, {phone}, {email}, {price}, {commercialPrice}, {tech}, {years}, {warranty}, {hours}";

const business = {
  name: "Kind Appliance Repair",
  shortName: "Kind",
  legalName: "I Am Kind LLC",
  tagline: "Honest appliance repair for Hillsboro, Beaverton & the West Side",
  description:
    "Residential and commercial appliance repair in Hillsboro, Beaverton and the Portland metro West Side. Refrigerators, washers, dryers, dishwashers, ovens and more. Fast scheduling, upfront pricing.",
  phone: "(503) 555-0142",
  email: "service@kindappliancerepair.com",
  address: { street: "", city: "Hillsboro", region: "OR", postalCode: "97123", country: "US" },
  hoursShort: "Open 24/7",
  hoursNote: "emergency dispatch every day",
  hoursDisplay: [{ label: "Every day", value: "Open 24 hours" }],
  areasLine: "Hillsboro · Beaverton · Aloha · Tigard · Portland West Side",
  footerAbout:
    "Local, family-run appliance repair for homes and businesses on Portland's West Side. Upfront pricing, clean work, pets welcome.",
  ccbNumber: "",
  pricing: { serviceCall: 120, commercialServiceCall: 150, creditedOnRepair: true },
  promises: {
    warranty: "90-day parts & labor warranty",
    sameDay: "Same-day & next-day appointments",
    licensed: "Licensed & insured in Oregon",
    upfront: "Upfront pricing, no surprises",
    pets: "Pet-friendly, clean work",
  },
  social: { google: "", googleReviews: "", facebook: "", instagram: "", yelp: "", nextdoor: "" },
};

const brand = {
  logo: "",
  wordmark: "Kind",
  wordmarkSub: "Appliance repair",
  technician: {
    name: "Ilia",
    role: "Owner & technician",
    years: "7+",
    photo: "",
    specialties: "Refrigerators, laundry, dishwashers & ovens. Whirlpool, GE, Samsung, LG, Bosch and more",
    bio: "After years with larger repair companies, I started Kind to repair appliances the way I would want it done in my own home: one honest price before work, a real diagnosis, and clean work around your family and pets.",
  },
  photos: { hero: "", work: "", pet1: "", pet2: "" },
};

const home = {
  seoTitle: "Appliance Repair in Hillsboro & Beaverton, OR | {company}",
  seoDescription:
    "Honest, local appliance repair in Hillsboro, Beaverton and the West Side. Refrigerators, washers, dryers, dishwashers, ovens. Open 24/7, upfront pricing, 90-day warranty. Book online or call.",
  heroEyebrow: "Hillsboro · Beaverton · West Side",
  heroTitle: "Appliance repair, done the kind way.",
  heroIntro:
    "Local, family-run repair for refrigerators, washers, dryers, dishwashers and ovens. One honest price before work, clean work around your family and pets, and often a visit the same day.",
  formTitle: "Book a technician",
  formIntro: "Leave your number and we call back to confirm a time. Usually same day.",
  homeTileTitle: "For homes",
  homeTileText: "Kitchen and laundry repair for homeowners, renters and landlords.",
  bizTileTitle: "For businesses",
  bizTileText: "Restaurants, cafés, offices and rentals. Priority scheduling available.",
};

const blocks = {
  heroChipPets: "Pet-friendly",
  trust: [
    { icon: "badge", label: "Licensed & insured" },
    { icon: "shield", label: "90-day warranty" },
    { icon: "dollar", label: "Upfront pricing" },
    { icon: "calendar", label: "Same-day visits" },
  ],
  picker: {
    eyebrow: "Book in a minute",
    title: "What needs fixing?",
    intro: "Tap your appliance. We open the booking form with it already selected: you add a phone number and pick a time.",
    emergency: "Not sure? Emergency?",
  },
  tech: {
    headline: "Your repair will be done by {tech}, the owner.",
    headlineBold: "Not a subcontractor, not a call center.",
    facts: [
      { value: "{years}", label: "years repairing appliances" },
      { value: "1", label: "technician, start to finish" },
      { value: "90", label: "day parts & labor warranty" },
    ],
    note: "Shoe covers and a floor mat on every visit",
  },
  process: {
    eyebrow: "How it works",
    title: "From booking to repair, step by step",
    intro: "No phone tag and no all-day windows. Here is exactly what happens after you book.",
    steps: [
      { icon: "calendar", title: "Book online or call", pill: "≈ 2 min", text: "Pick your appliance and a time that works. You talk to a real person, not voicemail." },
      { icon: "message", title: "Confirmation", pill: "Same day", text: "We call or text back to confirm your arrival window." },
      { icon: "truck", title: "“On my way” text", pill: "Day of", text: "A heads-up before the technician heads to you, so you are not stuck waiting all day." },
      {
        icon: "search",
        title: "Diagnosis & upfront quote",
        pill: "On site",
        text: "{price} service call, credited toward the repair if you go ahead. You get the price before any work starts.",
      },
      {
        icon: "wrench",
        title: "Repair & warranty",
        pill: "Usually 1 visit",
        text: "Common parts ride on the van. Special-order parts usually take a few business days. Backed by our {warranty}.",
      },
    ],
  },
  pricing: {
    eyebrow: "Upfront pricing",
    title: "One clear price to start. No surprises after.",
    intro: "You always know the cost before we touch a screwdriver. If the repair does not make sense, we tell you.",
    footnote: "Decide not to repair? You pay only the {price} service call and keep the diagnosis and photos.",
    included: [
      { icon: "truck", text: "A visit to your home at a time you pick" },
      { icon: "search", text: "Full diagnosis, not a guess" },
      { icon: "camera", text: "Photos of what failed, explained in plain words" },
      { icon: "tag", text: "A firm quote before any work starts" },
      { icon: "hammer", text: "Honest advice when a repair is not worth it" },
    ],
    warrantyNote: "Same problem comes back? We return and make it right.",
  },
  why: {
    eyebrow: "Why Kind",
    title: "Why neighbors call Kind",
    points: [
      { icon: "badge", title: "Licensed & insured", text: "A local Oregon business that answers for every repair." },
      { icon: "message", title: "Honest advice", text: "If a repair isn't worth the money, we say so. No upselling, no pressure." },
      { icon: "dollar", title: "Upfront pricing", text: "You get the price before work starts. The service call goes toward the repair." },
      { icon: "paw", title: "Clean & pet-friendly", text: "Shoe covers, a floor mat and calm work around your family and pets." },
      { icon: "wrench", title: "All major brands", text: "From Whirlpool and GE to Bosch, Sub-Zero, Wolf and Miele." },
      { icon: "clock", title: "Open 24/7", text: "Emergency dispatch every day for leaks, warm fridges and dead freezers." },
    ],
  },
  pets: {
    eyebrow: "Pet-friendly",
    title: "Your dog can supervise. We do not mind.",
    text: "Most homes we visit have a dog or a cat. Pets are welcome to stay where they are comfortable, and we work around them.",
    checks: [
      "Shoe covers and a floor mat on every visit",
      "Tools stay on the mat, never where a curious nose can reach",
      "Doors and gates closed behind us if you ask",
      "Calm and quiet, no rushing around your home",
    ],
  },
  reviews: { eyebrow: "Reviews", title: "What customers say", intro: "Words from real customers about our work." },
  areas: {
    eyebrow: "Service area",
    title: "Based in Hillsboro, serving the West Side",
    text: "Beaverton, Aloha, Tigard, Forest Grove and the neighborhoods in between. Not sure we reach you? Call and ask.",
  },
  servicesGrid: {
    eyebrow: "What we fix",
    title: "Appliance repair services",
    intro: "From the fridge to the laundry room. Each page lists common problems and the types we repair.",
    button: "All services",
    cardLink: "Details & common problems",
  },
  contactAside: {
    phoneTitle: "Faster by phone",
    nextTitle: "What happens next",
    next: ["We call or text to confirm a time", "“On my way” text on the day", "Diagnosis and a firm quote on site", "You approve, we repair"],
    hoursTitle: "Hours",
    areaTitle: "Service area",
    emailTitle: "Email",
  },
  brandsTitle: "We repair all major brands",
  faq: { title: "Frequently asked questions", intro: "Don't see your question? Call us. We're happy to help." },
  cta: {
    title: "Appliance down? We can usually be there today.",
    text: "Call any time, 24/7, or book online and we will call you back to confirm a time.",
  },
};

const about = {
  seoTitle: "About Us: Local, Family-Run Appliance Repair in Hillsboro, OR",
  seoDescription:
    "Kind Appliance Repair is a local, family-run appliance repair business in Hillsboro, Oregon. Honest pricing, clean work, pet-friendly.",
  eyebrow: "About",
  title: "Local, family-run, and good with pets",
  intro: "{years} years repairing appliances on Portland's West Side. {company} is our own business: we answer for every repair.",
  photoCaption: "Pets welcome. Shoe covers and floor mats on every visit.",
  whyTitle: "Why Kind",
  paragraphs: [
    "After years working for larger repair companies, we started Kind to do repairs the way we would want them done in our own homes: one honest price before work, real diagnosis instead of guesswork, and clean work around your family and pets.",
    "Every visit follows the same routine. We put down a floor mat, test the appliance properly, photograph what failed, and explain your options in plain words. If a repair is not worth the money, we say so.",
    "We also look at the things that cause the next breakdown: dryer vents, drum rollers and belts, refrigerator condenser coils. We check them for free and show you photos, so you decide whether they need service.",
  ],
  formTitle: "Book a technician",
  formIntro: "Leave your number and we call back to confirm a time. Usually same day.",
};

const residential = {
  seoTitle: "Residential Appliance Repair in Hillsboro & Beaverton, OR",
  seoDescription:
    "Home appliance repair for homeowners, renters and landlords in Hillsboro, Beaverton and the West Side. Kitchen and laundry appliances, all major brands, upfront pricing.",
  eyebrow: "For homeowners & renters",
  title: "Residential Appliance Repair in Hillsboro & Beaverton",
  intro: "Kitchen and laundry appliance repair for West Side homes, done by friendly local technicians who treat your home with respect.",
  body: [
    "When the fridge stops cooling or the washer won't drain, your whole routine stops with it. Kind Appliance Repair gets a qualified technician to your door quickly, explains the problem in plain English and gives you a firm price before any work begins.",
    "We repair every major brand, from builder-grade appliances in new construction to premium built-ins, and we carry the most common parts on our trucks so most repairs are finished on the first visit.",
  ],
  audience: [
    { title: "Homeowners", text: "Get your appliances back up and running fast, with honest repair-vs-replace advice." },
    { title: "Renters", text: "Landlord unavailable? We can coordinate directly with your property manager." },
    { title: "Landlords & property managers", text: "Fast turnaround, photo documentation and clear invoices for every unit." },
    { title: "Real estate & home sales", text: "Pre-listing and inspection-related appliance repairs on a deadline." },
  ],
  equipmentTitle: "Home appliances we repair",
  equipment: [
    "Refrigerators", "Freezers", "Washers", "Dryers", "Dishwashers", "Ranges & stoves", "Wall ovens",
    "Cooktops", "Microwaves", "Ice makers", "Wine coolers", "Range hoods", "Garbage disposals",
  ],
  benefitsTitle: "What you can expect",
  benefits: [
    "Arrival windows that respect your schedule",
    "Upfront price before any work",
    "Shoe covers & clean workspace",
    "Text updates when we're on the way",
    "Most repairs completed in one visit",
    "Parts & labor warranty",
  ],
  servicesTitle: "Residential repair services",
  formTitle: "Request service",
  formIntro: "We'll call you back to confirm details and timing.",
  faqs: [] as { q: string; a: string }[],
};

const commercial = {
  seoTitle: "Commercial Appliance Repair in Hillsboro & Beaverton, OR",
  seoDescription:
    "Commercial appliance and kitchen equipment repair for restaurants, cafés, offices, laundromats and property managers in Hillsboro, Beaverton and the West Side. Priority scheduling.",
  eyebrow: "For businesses",
  title: "Commercial Appliance Repair in Hillsboro & Beaverton",
  intro: "Downtime costs you money. We keep West Side restaurants, offices and properties running with fast, reliable commercial appliance repair.",
  body: [
    "When a reach-in cooler fails before the dinner rush or a laundromat washer goes down on a Saturday, you need a technician who shows up and solves it. Kind Appliance Repair offers priority scheduling for business customers across Hillsboro, Beaverton and the West Side.",
    "We work with restaurant owners, facility managers and property management companies, with clear communication, documented work orders and invoices your accounting team will appreciate.",
  ],
  audience: [
    { title: "Restaurants & cafés", text: "Refrigeration, ice machines, ovens and ranges. Minimizing downtime is our priority." },
    { title: "Property managers & HOAs", text: "One reliable vendor for appliance repairs across all your units and buildings." },
    { title: "Offices & break rooms", text: "Refrigerators, dishwashers, microwaves and ice makers that keep your team happy." },
    { title: "Laundromats & multifamily laundry", text: "Commercial washers and dryers serviced quickly to protect your revenue." },
  ],
  equipmentTitle: "Equipment we service",
  equipment: [
    "Reach-in coolers & freezers", "Under-counter refrigeration", "Ice machines", "Commercial ranges & ovens", "Convection ovens",
    "Commercial dishwashers", "Coin-op & commercial washers", "Commercial dryers", "Break-room appliances",
  ],
  benefitsTitle: "What you can expect",
  benefits: [
    "Priority & after-hours scheduling options",
    "Service agreements for regular maintenance",
    "Detailed work orders & invoices",
    "Net terms for approved accounts",
    "One point of contact for all locations",
    "Parts & labor warranty",
  ],
  servicesTitle: "",
  formTitle: "Request commercial service",
  formIntro: "We'll call you back to confirm details and timing.",
  faqs: [
    {
      q: "Do you offer maintenance plans for businesses?",
      a: "Yes. We offer preventive maintenance agreements for restaurants, property managers and other businesses. Regular service helps prevent expensive breakdowns. Contact us for a custom quote.",
    },
    { q: "Can you invoice our company or property management firm?", a: "Yes. We can bill your company directly and offer net terms for approved commercial accounts." },
    {
      q: "Do you provide emergency service for restaurants?",
      a: "We prioritize commercial refrigeration and cooking equipment failures. Call us directly for the fastest response.",
    },
    {
      q: "Which commercial brands do you work on?",
      a: "We service many commercial brands, including True, Turbo Air, Hoshizaki, Manitowoc, Scotsman, Vulcan, Speed Queen and more. Tell us the make and model when you call.",
    },
  ],
};
export type SegmentContent = typeof residential;

const pages = {
  services: {
    eyebrow: "Our services",
    heading: "Appliance repair services",
    intro:
      "Expert repair for every major kitchen and laundry appliance, for homes and businesses in Hillsboro, Beaverton and nearby communities.",
    seoTitle: "Appliance Repair Services in Hillsboro & Beaverton",
    seoDescription:
      "Refrigerator, washer, dryer, dishwasher, oven, freezer, microwave and ice maker repair in Hillsboro, Beaverton and the West Side. All major brands. Book today.",
  },
  service: {
    eyebrow: "Hillsboro · Beaverton · West Side",
    heading: "{service} in Hillsboro & Beaverton, OR",
    introTitle: "Local {appliance} repair you can count on",
    problemsTitle: "Common {appliance} problems we fix",
    typesTitle: "Types we service",
    brandsTitle: "Brands we repair",
    nearTitle: "{service} near you",
    formTitle: "Book {appliance} repair",
    formIntro: "Leave your number and we call back to confirm a time. Usually same day.",
    callTitle: "Prefer to talk to a person?",
    callNote: "{hours}. Emergency dispatch every day.",
    relatedTitle: "Other appliance repair services",
    faqTitle: "{service} FAQ",
    ctaTitle: "Need {appliance} repair today?",
  },
  areas: {
    eyebrow: "Where we work",
    heading: "Appliance repair service areas",
    intro: "Based in Hillsboro, we serve homes and businesses throughout Washington County and Portland's West Side.",
    cardTitle: "Appliance Repair {city}",
    cardLink: "View {city}",
    missingText: "Don't see your city? We may still be able to help.",
    missingLink: "Contact us",
    seoTitle: "Service Areas: Hillsboro, Beaverton & West Side, OR",
    seoDescription:
      "{company} serves Hillsboro, Beaverton, Aloha, Tigard, Forest Grove, Cornelius, Tualatin and Portland's West Side. Find appliance repair near you.",
  },
  city: {
    eyebrow: "{county}, Oregon",
    heading: "Appliance Repair in {city}, OR",
    servicesTitle: "Appliance repair services in {city}",
    servicesIntro: "Whatever's broken, our {city} appliance repair technicians can help. Choose a service to learn more.",
    neighborhoodsTitle: "Neighborhoods & ZIP codes we serve in {city}",
    segmentTitle: "Residential & commercial service in {city}",
    segmentText: "We help {city} homeowners, renters and landlords, as well as restaurants, offices and property managers.",
    formTitle: "Book a technician in {city}",
    formIntro: "We'll call you back to confirm a time.",
    nearbyTitle: "Nearby service areas",
    nearbyLink: "Appliance repair {city}",
    faqTitle: "Appliance repair in {city}: FAQ",
    ctaTitle: "Fast appliance repair in {city}",
    seoTitle: "Appliance Repair {city}, OR | Same-Day Service",
    seoDescription:
      "Trusted appliance repair in {city}, Oregon. Refrigerator, washer, dryer, dishwasher and oven repair for homes and businesses. Upfront pricing. Call {phone}.",
  },
  reviews: {
    eyebrow: "Reviews",
    heading: "What our customers say",
    intro: "We earn our reputation one repair at a time. Here's what neighbors across the West Side have to say.",
    googleButton: "Read us on Google",
    emptyText: "We are collecting our first reviews. Had a repair with us? We would love to hear how it went.",
    ctaTitle: "Had a great experience?",
    ctaText: "Reviews help local businesses like ours more than you know. We'd be grateful for yours.",
    ctaButton: "Leave a Google review",
    seoTitle: "Customer Reviews",
    seoDescription:
      "Read what customers in Hillsboro, Beaverton and the West Side say about {company}. Honest service, upfront pricing, repairs that last.",
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    intro: "Everything you need to know before booking. Still have a question? Give us a call.",
    generalTitle: "General questions",
    specificTitle: "Appliance-specific questions",
    seoTitle: "Appliance Repair FAQ",
    seoDescription:
      "Answers to common questions about appliance repair costs, scheduling, warranty, brands and service areas from {company} in Hillsboro, OR.",
  },
  contact: {
    eyebrow: "Contact",
    heading: "Request appliance repair service",
    intro: "Tell us what's broken and we'll call you back to confirm your appointment, usually within the hour.",
    submitLabel: "Send my request",
    seoTitle: "Contact Us & Request Service",
    seoDescription:
      "Request appliance repair service in Hillsboro, Beaverton and the West Side. Fill out the form or call {company}. Open 24/7.",
  },
  book: {
    eyebrow: "Online booking",
    heading: "Book a service visit",
    intro: "Three quick steps, about a minute. We call or text to confirm your arrival window. {hours}.",
    seoTitle: "Book Appliance Repair Online",
    seoDescription:
      "Book an appliance repair appointment online in Hillsboro, Beaverton and the West Side. Pick your appliance and a time, and we'll confirm shortly.",
  },
  privacy: {
    heading: "Privacy Policy",
    updated: "",
    blocks: [
      {
        title: "Information we collect",
        text: "When you request service, we collect the details you provide: your name, phone number, email, ZIP code and information about your appliance. We also collect standard website analytics data such as pages visited, device type and how you found our site (for example, the ad or search that brought you here).",
      },
      {
        title: "How we use it",
        text: "We use your information to contact you about your service request, schedule and perform repairs, send appointment reminders, and improve our website and advertising. We do not sell your personal information.",
      },
      {
        title: "Calls & text messages",
        text: "By submitting a request you agree that we may call or text you about your service request. Message and data rates may apply. Reply STOP to opt out of text messages at any time. Calls may be recorded for quality and training purposes.",
      },
      {
        title: "Cookies & analytics",
        text: "We use cookies and similar technologies from providers such as Google Analytics, Google Ads and Meta to understand how visitors use our site and to measure advertising. You can disable cookies in your browser settings.",
      },
      {
        title: "Third-party service providers",
        text: "We share information only with providers that help us run our business, such as scheduling, customer management, call tracking and email services, and only as needed to serve you.",
      },
      { title: "Contact us", text: "Questions about this policy? Contact {company} at {email} or {phone}." },
    ],
    seoTitle: "Privacy Policy",
    seoDescription: "How {company} collects, uses and protects your information.",
  },
};

export const formIcons = [
  { value: "refrigerator", label: "Refrigerator" },
  { value: "washer", label: "Washer" },
  { value: "dryer", label: "Dryer" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "oven", label: "Oven & stove" },
  { value: "cooktop", label: "Cooktop" },
  { value: "freezer", label: "Freezer" },
  { value: "microwave", label: "Microwave" },
  { value: "icemaker", label: "Ice maker" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

const form = {
  appliances: [
    { name: "Refrigerator", icon: "refrigerator" },
    { name: "Washer", icon: "washer" },
    { name: "Dryer", icon: "dryer" },
    { name: "Dishwasher", icon: "dishwasher" },
    { name: "Oven / Range / Stove", icon: "oven" },
    { name: "Cooktop", icon: "cooktop" },
    { name: "Freezer", icon: "freezer" },
    { name: "Microwave", icon: "microwave" },
    { name: "Ice Maker", icon: "icemaker" },
    { name: "Commercial Equipment", icon: "commercial" },
    { name: "Other", icon: "other" },
  ],
  stepAppliance: "What needs fixing?",
  stepUrgency: "How soon do you need us?",
  stepContact: "How do we reach you?",
  urgency: {
    standard: { label: "Same or next day", hint: "Standard visit" },
    today: { enabled: true, label: "Today if possible", hint: "Priority" },
    emergency: { enabled: true, label: "Emergency", hint: "Leak, no cooling, 24/7" },
  },
  windows: ["As soon as possible", "Morning (8 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Late afternoon (4 PM – 6 PM)", "Flexible"],
  submitFull: "Request my appointment",
  submitCompact: "Request a call back",
  note: "We quote before any work starts. Your info is never sold.",
  callPrompt: "In a hurry? Call",
};
export type FormContent = typeof form;

const integrations = {
  gtmId: "",
  ga4Id: "",
  googleAdsId: "",
  googleAdsLeadLabel: "",
  metaPixelId: "",
  googleSiteVerification: "",
  bookingUrl: "",
  leadEmail: "",
};
export type PageKey = keyof typeof pages;

const services = { items: defaultServices, brands: defaultBrands };
const areas = { items: defaultAreas };
const faqs = { items: defaultFaqs };
const reviews = { items: defaultReviews };

const prices = {
  eyebrow: "Pricing",
  heading: "Appliance repair prices",
  intro:
    "Flat, upfront prices for the repairs we do most. You know the number before we start, and your technician confirms it for your model after the diagnosis.",
  diagnosticsTitle: "Every repair starts with a diagnosis",
  diagnosticsText: "A technician comes to you, finds the real cause and gives you a firm price before any work begins.",
  maintenanceTitle: "Maintenance & cleaning",
  maintenanceIntro: "Regular care prevents breakdowns and dryer fires, and keeps energy bills down. For homes and businesses.",
  residentialTitle: "Home appliance repair",
  residentialIntro: "Typical prices for the most common repairs. Pick your appliance to jump to its list.",
  commercialTitle: "Commercial appliances",
  commercialIntro: "Installation and repair for restaurants, offices, laundries and rental properties.",
  premiumTitle: "High-end & built-in appliances",
  premiumIntro:
    "Luxury and built-in models such as Sub-Zero, Wolf, Thermador, Miele and Viking use different parts and procedures. We quote these after the diagnosis.",
  notes: [
    "Your technician confirms the exact price for your model before any work begins. Nothing is done without your approval.",
    "Items marked “Labor only” don't include the cost of parts.",
    "“Add-on” services are offered during a repair visit.",
    "Prices may change. The price confirmed on site is the one you pay.",
  ],
  serviceBlockTitle: "Typical {appliance} repair prices",
  serviceBlockIntro: "Upfront prices for common repairs. The final price is confirmed after the {price} diagnosis.",
  ctaTitle: "Not sure what's wrong?",
  ctaText: "Book a diagnosis. We find the cause and give you the price before any work starts.",
  seoTitle: "Appliance Repair Prices in Hillsboro & Beaverton, OR",
  seoDescription:
    "Upfront appliance repair prices: {price} diagnostic, refrigerator, washer, dryer, dishwasher, range and cooktop repair, maintenance and installation.",
  categories: defaultPriceCategories,
};

export const defaults = { business, brand, home, blocks, about, residential, commercial, pages, form, services, areas, faqs, reviews, prices, integrations };
export type SectionKey = keyof typeof defaults;
export type Content = typeof defaults;
export const sectionKeys = Object.keys(defaults) as SectionKey[];

const iconText = (textKey: string): Field[] => [
  { kind: "icon", key: "icon", label: "Icon" },
  { kind: "text", key: textKey, label: "Text", required: true },
];

const sectionHead = (prefix: string, opts: { intro?: boolean } = {}): Field[] => [
  { kind: "text", key: `${prefix}.eyebrow`, label: "Eyebrow", help: "The small orange line above the heading" },
  { kind: "text", key: `${prefix}.title`, label: "Heading", required: true },
  ...(opts.intro === false ? [] : [{ kind: "textarea", key: `${prefix}.intro`, label: "Subheading", rows: 2 } as Field]),
];

const titleSuffix = "“ | company name” is added to the Title when the result fits in 65 characters.";

type PageGroupOptions = { extra?: string; hero?: boolean; intro?: boolean; fields?: Field[]; seo?: boolean };

function pageGroup(key: PageKey, title: string, path: string, opts: PageGroupOptions = {}): Group {
  const k = (f: string) => `${key}.${f}`;
  const hero: Field[] = [];
  if (opts.hero !== false) {
    hero.push({ kind: "text", key: k("eyebrow"), label: "Eyebrow" }, { kind: "text", key: k("heading"), label: "H1 heading", required: true });
    if (opts.intro !== false) hero.push({ kind: "textarea", key: k("intro"), label: "Subheading", rows: 2 });
  }
  const seo: Field[] =
    opts.seo === false
      ? []
      : [
          { kind: "text", key: k("seoTitle"), label: "SEO: Title", required: true, max: 120, help: `Best under 60 characters. ${titleSuffix}` },
          { kind: "textarea", key: k("seoDescription"), label: "SEO: Description", rows: 3, max: 300, help: "The snippet in Google results, best under 160 characters" },
        ];
  return {
    title: `${title} · ${path}`,
    description: [opts.extra, placeholdersHelp].filter(Boolean).join(" "),
    fields: [...hero, ...(opts.fields ?? []).map((f) => ({ ...f, key: k(f.key) })), ...seo],
  };
}

const text = (key: string, label: string, help?: string): Field => ({ kind: "text", key, label, help });
const area = (key: string, label: string, help?: string): Field => ({ kind: "textarea", key, label, rows: 2, help });

function segmentSection(key: "residential" | "commercial", title: string, path: string, home: boolean): SectionDef {
  return {
    key,
    title,
    description: `Texts of the ${path} page.`,
    groups: [
      {
        title: "Hero",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "eyebrow", label: "Eyebrow" },
          { kind: "text", key: "title", label: "H1 heading", required: true },
          { kind: "textarea", key: "intro", label: "Subheading", rows: 3 },
        ],
      },
      {
        title: "Main text",
        fields: [
          { kind: "strings", key: "body", label: "Paragraphs", itemLabel: "paragraph", max: 8 },
          {
            kind: "list",
            key: "audience",
            label: "Who it is for (cards)",
            itemLabel: "card",
            titleKey: "title",
            max: 8,
            item: [
              { kind: "text", key: "title", label: "Heading", required: true },
              { kind: "textarea", key: "text", label: "Text", rows: 2 },
            ],
          },
          { kind: "text", key: "equipmentTitle", label: "Equipment list heading", required: true },
          { kind: "strings", key: "equipment", label: "Equipment list", itemLabel: "item", max: 30 },
          { kind: "text", key: "benefitsTitle", label: "Green block heading", required: true },
          { kind: "strings", key: "benefits", label: "Green block items", itemLabel: "item", max: 12 },
          ...(home
            ? [{ kind: "text", key: "servicesTitle", label: "Service tiles heading", help: "Empty: the service tiles are hidden" } as Field]
            : []),
        ],
      },
      {
        title: "Request form",
        fields: [
          { kind: "text", key: "formTitle", label: "Form heading", required: true },
          { kind: "textarea", key: "formIntro", label: "Text under the heading", rows: 2 },
        ],
      },
      {
        title: "Questions and answers",
        description: "If the list is empty, the first 6 general questions from the FAQ section are shown.",
        fields: [
          {
            kind: "list",
            key: "faqs",
            label: "Questions",
            itemLabel: "question",
            titleKey: "q",
            max: 12,
            item: [
              { kind: "text", key: "q", label: "Question", required: true },
              { kind: "textarea", key: "a", label: "Answer", rows: 3, required: true },
            ],
          },
        ],
      },
      {
        title: "SEO",
        description: `How the page looks in Google. ${titleSuffix} ${placeholdersHelp}`,
        fields: [
          { kind: "text", key: "seoTitle", label: "Title", max: 120 },
          { kind: "textarea", key: "seoDescription", label: "Description", rows: 3, max: 300 },
        ],
      },
    ],
  };
}

export const sections: SectionDef[] = [
  {
    key: "business",
    title: "Company & contacts",
    description: "Name, phone, email, address, hours, pricing and social links. Used on every page.",
    groups: [
      {
        title: "Name",
        fields: [
          { kind: "text", key: "name", label: "Company name", required: true, help: "In browser tab titles, the footer and the data for Google" },
          { kind: "text", key: "shortName", label: "Short name", required: true },
          { kind: "text", key: "legalName", label: "Legal name", help: "Shown in the footer" },
          { kind: "text", key: "tagline", label: "Tagline" },
          { kind: "textarea", key: "description", label: "Search engine description", rows: 3, max: 300, help: "The site's default description in Google (best under 160 characters)" },
        ],
      },
      {
        title: "Contact",
        fields: [
          { kind: "phone", key: "phone", label: "Phone", help: "A 10-digit US number, e.g. (503) 555-0142. Changes everywhere: buttons, header, footer, Google" },
          { kind: "email", key: "email", label: "Email" },
          { kind: "text", key: "address.street", label: "Street address", help: "Leave empty if customers do not visit an office" },
          { kind: "text", key: "address.city", label: "City", required: true },
          { kind: "text", key: "address.region", label: "State", required: true },
          { kind: "text", key: "address.postalCode", label: "ZIP" },
          { kind: "text", key: "areasLine", label: "Areas line in the top bar" },
        ],
      },
      {
        title: "Hours",
        fields: [
          { kind: "text", key: "hoursShort", label: "Short", required: true, help: "For example, Open 24/7 or Mon–Sat 8–6" },
          { kind: "text", key: "hoursNote", label: "Note in the top bar" },
          {
            kind: "list",
            key: "hoursDisplay",
            label: "Schedule",
            itemLabel: "line",
            titleKey: "label",
            max: 7,
            item: [
              { kind: "text", key: "label", label: "Days", required: true },
              { kind: "text", key: "value", label: "Hours", required: true },
            ],
          },
        ],
      },
      {
        title: "Price & promises",
        description: "These phrases appear in chips, badges and the pricing block.",
        fields: [
          { kind: "number", key: "pricing.serviceCall", label: "Service call fee, $", min: 0, max: 10000, help: "Residential diagnostic. Used by {price} and the price list" },
          { kind: "number", key: "pricing.commercialServiceCall", label: "Commercial service call fee, $", min: 0, max: 10000, help: "Shown on the commercial page and in the price list" },
          { kind: "toggle", key: "pricing.creditedOnRepair", label: "Service call is credited toward the repair", help: "Turns on the “$120 − $120 = $0” graphic" },
          { kind: "text", key: "promises.warranty", label: "Warranty" },
          { kind: "text", key: "promises.sameDay", label: "Scheduling" },
          { kind: "text", key: "promises.licensed", label: "License" },
          { kind: "text", key: "promises.upfront", label: "Pricing" },
          { kind: "text", key: "promises.pets", label: "Pets" },
          { kind: "text", key: "ccbNumber", label: "Oregon CCB license number", help: "If set, shown in the footer and the technician block" },
        ],
      },
      {
        title: "Footer",
        fields: [{ kind: "textarea", key: "footerAbout", label: "Text under the logo", rows: 3 }],
      },
      {
        title: "Links",
        fields: [
          { kind: "url", key: "social.google", label: "Google Business Profile" },
          { kind: "url", key: "social.googleReviews", label: "Google reviews", help: "If set, a “See on Google” button appears next to the reviews" },
          { kind: "url", key: "social.facebook", label: "Facebook" },
          { kind: "url", key: "social.instagram", label: "Instagram" },
          { kind: "url", key: "social.yelp", label: "Yelp" },
          { kind: "url", key: "social.nextdoor", label: "Nextdoor" },
        ],
      },
    ],
  },
  {
    key: "brand",
    title: "Logo & photos",
    description: "Logo, technician and photos on the site. Until a photo is added, a branded panel is shown instead.",
    groups: [
      {
        title: "Logo",
        fields: [
          { kind: "image", key: "logo", label: "Logo badge", shape: "square", help: "A square image. Empty: the standard round logo" },
          { kind: "text", key: "wordmark", label: "Wordmark next to the badge", required: true, help: "The dot at the end is added automatically" },
          { kind: "text", key: "wordmarkSub", label: "Line under the wordmark" },
        ],
      },
      {
        title: "Technician",
        fields: [
          { kind: "image", key: "technician.photo", label: "Photo", shape: "square", help: "A square face photo. Empty: the first letter of the name" },
          { kind: "text", key: "technician.name", label: "Name", required: true },
          { kind: "text", key: "technician.role", label: "Role" },
          { kind: "text", key: "technician.years", label: "Years of experience", help: "For example, 7+" },
          { kind: "textarea", key: "technician.bio", label: "Quote", rows: 4 },
          { kind: "textarea", key: "technician.specialties", label: "Specialties", rows: 2 },
        ],
      },
      {
        title: "Photos",
        fields: [
          { kind: "image", key: "photos.hero", label: "Main photo on the About page", shape: "tall" },
          { kind: "image", key: "photos.work", label: "Work photo", shape: "wide" },
          { kind: "image", key: "photos.pet1", label: "Pets block, photo 1", shape: "tall" },
          { kind: "image", key: "photos.pet2", label: "Pets block, photo 2", shape: "tall" },
        ],
      },
    ],
  },
  {
    key: "home",
    title: "Home page",
    description: "Hero, booking form and the homes / businesses tiles. The other home page blocks are in Shared blocks.",
    groups: [
      {
        title: "Hero",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "heroEyebrow", label: "Eyebrow" },
          { kind: "text", key: "heroTitle", label: "H1 heading", required: true, help: "A dot at the end turns orange" },
          { kind: "textarea", key: "heroIntro", label: "Subheading", rows: 3 },
          { kind: "text", key: "formTitle", label: "Form heading" },
          { kind: "textarea", key: "formIntro", label: "Text under the form heading", rows: 2 },
        ],
      },
      {
        title: "Homes / businesses tiles",
        fields: [
          { kind: "text", key: "homeTileTitle", label: "Homes: heading" },
          { kind: "textarea", key: "homeTileText", label: "Homes: text", rows: 2 },
          { kind: "text", key: "bizTileTitle", label: "Businesses: heading" },
          { kind: "textarea", key: "bizTileText", label: "Businesses: text", rows: 2 },
        ],
      },
      {
        title: "SEO",
        description: "How the page looks in Google search. " + placeholdersHelp,
        fields: [
          { kind: "text", key: "seoTitle", label: "Title", max: 120 },
          { kind: "textarea", key: "seoDescription", label: "Description", rows: 3, max: 300 },
        ],
      },
    ],
  },
  {
    key: "blocks",
    title: "Shared blocks",
    description: "Blocks repeated on several pages: steps, pricing, why us, reviews, call to action.",
    groups: [
      {
        title: "Trust badges",
        description: "The strip under the home page hero.",
        fields: [
          { kind: "list", key: "trust", label: "Badges", itemLabel: "badge", titleKey: "label", max: 8, item: iconText("label") },
          { kind: "text", key: "heroChipPets", label: "Pets chip in the hero" },
        ],
      },
      {
        title: "Appliance picker",
        fields: [
          ...sectionHead("picker"),
          { kind: "text", key: "picker.emergency", label: "Call tile" },
        ],
      },
      {
        title: "Technician block",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "tech.headline", label: "Line above the card" },
          { kind: "text", key: "tech.headlineBold", label: "Bold continuation" },
          {
            kind: "list",
            key: "tech.facts",
            label: "Numbers",
            itemLabel: "number",
            titleKey: "label",
            max: 3,
            item: [
              { kind: "text", key: "value", label: "Number", required: true },
              { kind: "text", key: "label", label: "Caption", required: true },
            ],
          },
          { kind: "text", key: "tech.note", label: "Line under the card" },
        ],
      },
      {
        title: "Steps from booking to repair",
        description: placeholdersHelp,
        fields: [
          ...sectionHead("process"),
          {
            kind: "list",
            key: "process.steps",
            label: "Steps",
            itemLabel: "step",
            titleKey: "title",
            max: 8,
            item: [
              { kind: "icon", key: "icon", label: "Icon" },
              { kind: "text", key: "title", label: "Heading", required: true },
              { kind: "text", key: "pill", label: "Timing pill" },
              { kind: "textarea", key: "text", label: "Text", rows: 2 },
            ],
          },
        ],
      },
      {
        title: "Pricing block",
        description: placeholdersHelp + ". The price itself is set in Company & contacts.",
        fields: [
          ...sectionHead("pricing"),
          { kind: "textarea", key: "pricing.footnote", label: "Note under the calculation", rows: 2 },
          { kind: "list", key: "pricing.included", label: "What the visit includes", itemLabel: "item", titleKey: "text", max: 8, item: iconText("text") },
          { kind: "text", key: "pricing.warrantyNote", label: "Warranty text" },
        ],
      },
      {
        title: "Why us",
        fields: [
          ...sectionHead("why", { intro: false }),
          {
            kind: "list",
            key: "why.points",
            label: "Cards",
            itemLabel: "card",
            titleKey: "title",
            max: 9,
            item: [
              { kind: "icon", key: "icon", label: "Icon" },
              { kind: "text", key: "title", label: "Heading", required: true },
              { kind: "textarea", key: "text", label: "Text", rows: 2 },
            ],
          },
        ],
      },
      {
        title: "Pets",
        fields: [
          { kind: "text", key: "pets.eyebrow", label: "Eyebrow" },
          { kind: "text", key: "pets.title", label: "Heading", required: true },
          { kind: "textarea", key: "pets.text", label: "Text", rows: 3 },
          { kind: "strings", key: "pets.checks", label: "Checklist items", itemLabel: "item", max: 8 },
        ],
      },
      { title: "Reviews", fields: sectionHead("reviews") },
      {
        title: "Service area",
        fields: [...sectionHead("areas", { intro: false }), { kind: "textarea", key: "areas.text", label: "Text", rows: 2 }],
      },
      {
        title: "Service tiles",
        description: "The services list block on the home page, the service area page and others. The services themselves are in Services.",
        fields: [
          ...sectionHead("servicesGrid"),
          { kind: "text", key: "servicesGrid.button", label: "“All services” button" },
          { kind: "text", key: "servicesGrid.cardLink", label: "Card link" },
        ],
      },
      {
        title: "Side column on Contact and Book",
        description: "Phone, hours and email come from Company & contacts, cities from Cities.",
        fields: [
          { kind: "text", key: "contactAside.phoneTitle", label: "Phone block heading" },
          { kind: "text", key: "contactAside.nextTitle", label: "“What happens next” heading" },
          { kind: "strings", key: "contactAside.next", label: "“What happens next” steps", itemLabel: "step", max: 6 },
          { kind: "text", key: "contactAside.hoursTitle", label: "“Hours” label" },
          { kind: "text", key: "contactAside.areaTitle", label: "“Service area” label" },
          { kind: "text", key: "contactAside.emailTitle", label: "“Email” label" },
        ],
      },
      {
        title: "Brands & FAQ",
        fields: [
          { kind: "text", key: "brandsTitle", label: "Brands strip heading" },
          { kind: "text", key: "faq.title", label: "FAQ heading" },
          { kind: "text", key: "faq.intro", label: "FAQ subheading" },
        ],
      },
      {
        title: "Orange call to action at the end of pages",
        fields: [
          { kind: "text", key: "cta.title", label: "Heading", required: true },
          { kind: "textarea", key: "cta.text", label: "Text", rows: 2 },
        ],
      },
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "Texts of the /about page. Its photos are in Logo & photos.",
    groups: [
      {
        title: "Hero",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "eyebrow", label: "Eyebrow" },
          { kind: "text", key: "title", label: "H1 heading", required: true },
          { kind: "textarea", key: "intro", label: "Subheading", rows: 3 },
          { kind: "text", key: "photoCaption", label: "Photo caption" },
        ],
      },
      {
        title: "Main text",
        fields: [
          { kind: "text", key: "whyTitle", label: "Heading", required: true },
          { kind: "strings", key: "paragraphs", label: "Paragraphs", itemLabel: "paragraph", max: 12 },
          { kind: "text", key: "formTitle", label: "Form heading" },
          { kind: "textarea", key: "formIntro", label: "Text under the form heading", rows: 2 },
        ],
      },
      {
        title: "SEO",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "seoTitle", label: "Title", max: 120 },
          { kind: "textarea", key: "seoDescription", label: "Description", rows: 3, max: 300 },
        ],
      },
    ],
  },
  segmentSection("residential", "For homes page", "/residential-appliance-repair", true),
  segmentSection("commercial", "For businesses page", "/commercial-appliance-repair", false),
  {
    key: "pages",
    title: "Site pages",
    description:
      "Texts and SEO of the pages without a section of their own: hero, block headings, buttons, Google Title and Description. Service and city names, questions and reviews are in their own sections.",
    groups: [
      pageGroup("services", "Services list", "/services"),
      pageGroup("service", "Service page template", "/services/…", {
        intro: false,
        extra:
          "One template for all services. {service} is the service name (Refrigerator Repair), {appliance} the appliance in a sentence (refrigerator). Each service's subheading, lists and SEO are in Services.",
        seo: false,
        fields: [
          text("introTitle", "Heading above the paragraphs"),
          text("problemsTitle", "Common problems heading"),
          text("typesTitle", "Types heading"),
          text("brandsTitle", "Brands heading"),
          text("nearTitle", "Cities heading"),
          text("formTitle", "Form heading"),
          area("formIntro", "Text under the form heading"),
          text("callTitle", "Green call block: heading"),
          text("callNote", "Green call block: note"),
          text("relatedTitle", "“Other services” heading"),
          text("faqTitle", "Questions heading"),
          text("ctaTitle", "Orange call to action at the bottom"),
        ],
      }),
      pageGroup("areas", "Service area", "/service-areas", {
        extra: "In the cards, {city} is the city name.",
        fields: [
          text("cardTitle", "City card heading"),
          text("cardLink", "Card link"),
          text("missingText", "Text under the cards"),
          text("missingLink", "Contact link after the text"),
        ],
      }),
      pageGroup("city", "City page template", "/service-areas/…", {
        intro: false,
        extra:
          "One template for all cities. {city} is the city name, {county} the county. Each city's subheading, neighborhoods and ZIP codes are in Cities.",
        fields: [
          text("servicesTitle", "Service tiles heading"),
          area("servicesIntro", "Text under it"),
          text("neighborhoodsTitle", "Neighborhoods & ZIP heading"),
          text("segmentTitle", "Homes & businesses block: heading"),
          area("segmentText", "Homes & businesses block: text"),
          text("formTitle", "Form heading"),
          text("formIntro", "Text under the form heading"),
          text("nearbyTitle", "Nearby cities heading"),
          text("nearbyLink", "Nearby city link", "Here {city} is the nearby city"),
          text("faqTitle", "Questions heading"),
          text("ctaTitle", "Orange call to action at the bottom"),
        ],
      }),
      pageGroup("reviews", "Reviews", "/reviews", {
        fields: [
          text("googleButton", "Google reviews button", "Shown when a Google reviews link is set in Company & contacts"),
          area("emptyText", "Text while there are no reviews"),
          text("ctaTitle", "Leave a review block: heading"),
          area("ctaText", "Leave a review block: text"),
          text("ctaButton", "Leave a review block: button"),
        ],
      }),
      pageGroup("faq", "FAQ", "/faq", {
        fields: [text("generalTitle", "General questions heading"), text("specificTitle", "Appliance questions heading")],
      }),
      pageGroup("contact", "Contact", "/contact", { fields: [text("submitLabel", "Form button text")] }),
      pageGroup("book", "Booking", "/book"),
      pageGroup("privacy", "Privacy policy", "/privacy-policy", {
        hero: false,
        extra:
          "Keep it true to how you work: remove the text messages or call recording lines if you do not text customers or record calls, and list the analytics you really use. A blank line in a text starts a new paragraph.",
        fields: [
          { kind: "text", key: "heading", label: "H1 heading", required: true },
          { kind: "text", key: "updated", label: "Last updated", help: "For example, October 2026. Empty: the current month" },
          {
            kind: "list",
            key: "blocks",
            label: "Sections",
            itemLabel: "section",
            titleKey: "title",
            max: 20,
            item: [
              { kind: "text", key: "title", label: "Heading", required: true },
              { kind: "textarea", key: "text", label: "Text", rows: 5, required: true },
            ],
          },
        ],
      }),
    ],
  },
  {
    key: "form",
    title: "Booking form",
    description: "The request form on every page: appliance choices, urgency, time windows and button texts. Headings above the form are set on each page.",
    groups: [
      {
        title: "Appliances",
        description:
          "The tiles in the form, in this order. Service pages preselect the first appliance with the same icon, so keep one appliance per icon that a service uses.",
        fields: [
          {
            kind: "list",
            key: "appliances",
            label: "Appliances",
            itemLabel: "appliance",
            titleKey: "name",
            unique: "name",
            max: 20,
            item: [
              { kind: "text", key: "name", label: "Name", required: true, max: 60, help: "As customers see it and as it arrives in the lead" },
              { kind: "select", key: "icon", label: "Icon", options: formIcons },
            ],
          },
        ],
      },
      {
        title: "Urgency",
        description: "The “How soon do you need us?” step. Turn off a level you cannot promise, for example Emergency if you do not take calls at night.",
        fields: [
          { kind: "text", key: "urgency.standard.label", label: "Standard: label", required: true, max: 60 },
          { kind: "text", key: "urgency.standard.hint", label: "Standard: hint", max: 80 },
          { kind: "toggle", key: "urgency.today.enabled", label: "Offer “Today”" },
          { kind: "text", key: "urgency.today.label", label: "Today: label", required: true, max: 60 },
          { kind: "text", key: "urgency.today.hint", label: "Today: hint", max: 80 },
          { kind: "toggle", key: "urgency.emergency.enabled", label: "Offer “Emergency”" },
          { kind: "text", key: "urgency.emergency.label", label: "Emergency: label", required: true, max: 60 },
          { kind: "text", key: "urgency.emergency.hint", label: "Emergency: hint", max: 80 },
        ],
      },
      {
        title: "Time windows",
        description: "The “Preferred time” list. “Any time” is always the first choice.",
        fields: [{ kind: "strings", key: "windows", label: "Windows", itemLabel: "window", max: 10 }],
      },
      {
        title: "Texts",
        fields: [
          { kind: "text", key: "stepAppliance", label: "Step 1 heading", required: true },
          { kind: "text", key: "stepUrgency", label: "Step 2 heading", required: true },
          { kind: "text", key: "stepContact", label: "Step 3 heading", required: true },
          { kind: "text", key: "submitFull", label: "Button on the full form", required: true, help: "The Contact page has its own button text in Site pages" },
          { kind: "text", key: "submitCompact", label: "Button on the short form", required: true, help: "The short form is on service pages and the home page" },
          {
            kind: "textarea",
            key: "note",
            label: "Note under the button",
            rows: 2,
            help: "Comes after the service call fee, which is added automatically from Company & contacts",
          },
          { kind: "text", key: "callPrompt", label: "Call prompt before the phone number" },
        ],
      },
    ],
  },
  {
    key: "services",
    title: "Services",
    description:
      "Service pages /services/…, the services tiles, menu and footer. The order here is the order on the site. A new service gets its own page right away.",
    groups: [
      {
        title: "Services list",
        description: "A service's questions appear on its page and on the FAQ page.",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Services",
            itemLabel: "service",
            titleKey: "name",
            unique: "slug",
            max: 30,
            item: [
              { kind: "text", key: "name", label: "Name", required: true, help: "For example, Refrigerator Repair" },
              { kind: "slug", key: "slug", label: "Page address", prefix: "/services/", help: "Latin letters, digits and dashes. Changing it breaks the old link" },
              {
                kind: "select",
                key: "icon",
                label: "Appliance",
                help: "The service icon and the appliance preselected in the booking form",
                options: [
                  { value: "refrigerator", label: "Refrigerator" },
                  { value: "washer", label: "Washer" },
                  { value: "dryer", label: "Dryer" },
                  { value: "dishwasher", label: "Dishwasher" },
                  { value: "oven", label: "Oven & stove" },
                  { value: "freezer", label: "Freezer" },
                  { value: "microwave", label: "Microwave" },
                  { value: "icemaker", label: "Ice maker" },
                  { value: "other", label: "Other" },
                ],
              },
              { kind: "text", key: "appliance", label: "Appliance in a sentence", required: true, help: "Lowercase, for phrases like “Common refrigerator problems we fix”" },
              { kind: "textarea", key: "short", label: "Short description", rows: 2, max: 300, help: "On the service tile and under the page heading" },
              { kind: "strings", key: "intro", label: "Paragraphs on the service page", itemLabel: "paragraph", max: 6 },
              { kind: "strings", key: "problems", label: "Common problems", itemLabel: "problem", max: 16 },
              { kind: "strings", key: "types", label: "Types we repair", itemLabel: "type", max: 16 },
              {
                kind: "list",
                key: "faqs",
                label: "Questions and answers",
                itemLabel: "question",
                titleKey: "q",
                max: 10,
                item: [
                  { kind: "text", key: "q", label: "Question", required: true },
                  { kind: "textarea", key: "a", label: "Answer", rows: 3, required: true },
                ],
              },
              { kind: "text", key: "seoTitle", label: "SEO: Title", max: 120, help: "Empty: built from the service page template heading" },
              { kind: "textarea", key: "seoDescription", label: "SEO: Description", rows: 3, max: 300, help: "Empty: the short description" },
            ],
          },
        ],
      },
      {
        title: "Brands",
        description: "The scrolling brands strip and the list on service pages (the first 14 there).",
        fields: [{ kind: "strings", key: "brands", label: "Brands", itemLabel: "brand", max: 40 }],
      },
    ],
  },
  {
    key: "prices",
    title: "Price list",
    description: "The /pricing page and the price blocks on service pages. Diagnostic fees are set in Company & contacts.",
    groups: [
      {
        title: "Page texts",
        description: placeholdersHelp,
        fields: [
          { kind: "text", key: "eyebrow", label: "Eyebrow" },
          { kind: "text", key: "heading", label: "H1 heading", required: true },
          { kind: "textarea", key: "intro", label: "Subheading", rows: 3 },
          { kind: "text", key: "diagnosticsTitle", label: "Diagnostics block: heading" },
          { kind: "textarea", key: "diagnosticsText", label: "Diagnostics block: text", rows: 2 },
          { kind: "text", key: "maintenanceTitle", label: "Maintenance & cleaning: heading" },
          { kind: "textarea", key: "maintenanceIntro", label: "Maintenance & cleaning: text", rows: 2 },
          { kind: "text", key: "residentialTitle", label: "Home repair: heading" },
          { kind: "textarea", key: "residentialIntro", label: "Home repair: text", rows: 2 },
          { kind: "text", key: "commercialTitle", label: "Commercial: heading" },
          { kind: "textarea", key: "commercialIntro", label: "Commercial: text", rows: 2 },
          { kind: "text", key: "premiumTitle", label: "High-end: heading" },
          { kind: "textarea", key: "premiumIntro", label: "High-end: text", rows: 3 },
          { kind: "strings", key: "notes", label: "Fine print at the bottom", itemLabel: "note", max: 10 },
          { kind: "text", key: "ctaTitle", label: "Bottom call to action: heading" },
          { kind: "textarea", key: "ctaText", label: "Bottom call to action: text", rows: 2 },
          { kind: "text", key: "seoTitle", label: "SEO: Title", max: 120 },
          { kind: "textarea", key: "seoDescription", label: "SEO: Description", rows: 3, max: 300 },
        ],
      },
      {
        title: "Block on service pages",
        description: "Shown on a service page when a category below lists that page. Also {service}, {appliance}.",
        fields: [
          { kind: "text", key: "serviceBlockTitle", label: "Heading" },
          { kind: "textarea", key: "serviceBlockIntro", label: "Text", rows: 2 },
        ],
      },
      {
        title: "Prices",
        description:
          "Each category is a card on the page. Maintenance categories are shown as package cards with the first price; high-end shows only the item names. Price 0 shows “Quote on site”.",
        fields: [
          {
            kind: "list",
            key: "categories",
            label: "Categories",
            itemLabel: "category",
            titleKey: "title",
            unique: "slug",
            max: 40,
            item: [
              { kind: "text", key: "title", label: "Title", required: true, help: "For example, Dishwasher" },
              { kind: "slug", key: "slug", label: "Anchor", prefix: "/pricing#", help: "Link straight to this card" },
              {
                kind: "select",
                key: "segment",
                label: "Section of the page",
                options: [
                  { value: "residential", label: "Home appliance repair" },
                  { value: "commercial", label: "Commercial appliances" },
                  { value: "maintenance", label: "Maintenance & cleaning (package card)" },
                  { value: "premium", label: "High-end (names only)" },
                ],
              },
              {
                kind: "select",
                key: "icon",
                label: "Icon",
                options: [
                  { value: "refrigerator", label: "Refrigerator" },
                  { value: "freezer", label: "Freezer" },
                  { value: "washer", label: "Washer" },
                  { value: "dryer", label: "Dryer" },
                  { value: "dishwasher", label: "Dishwasher" },
                  { value: "range", label: "Range" },
                  { value: "oven", label: "Oven" },
                  { value: "cooktop", label: "Cooktop" },
                  { value: "hood", label: "Range hood" },
                  { value: "microwave", label: "Microwave" },
                  { value: "icemaker", label: "Ice maker" },
                  { value: "install", label: "Installation" },
                  { value: "cleaning", label: "Cleaning" },
                  { value: "inspection", label: "Inspection" },
                  { value: "premium", label: "Premium" },
                ],
              },
              {
                kind: "strings",
                key: "services",
                label: "Show on service pages",
                itemLabel: "page address",
                max: 10,
                help: "The service page address without /services/, e.g. dryer-repair",
              },
              { kind: "textarea", key: "intro", label: "Line under the title", rows: 2, help: "Optional" },
              {
                kind: "list",
                key: "items",
                label: "Prices",
                itemLabel: "price",
                titleKey: "name",
                max: 30,
                item: [
                  { kind: "text", key: "name", label: "Service", required: true },
                  {
                    kind: "textarea",
                    key: "detail",
                    label: "Details",
                    rows: 2,
                    help: "Small text under the name. On package cards, each line becomes a checklist item",
                  },
                  { kind: "number", key: "price", label: "Price, $", min: 0, help: "0 = “Quote on site”" },
                  { kind: "text", key: "note", label: "Label", help: "For example, Labor only, Add-on with a repair, Most popular" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "areas",
    title: "Cities",
    description: "Pages /service-areas/…, the service area block, the footer and the data for Google. A new city gets its own page right away.",
    groups: [
      {
        title: "Cities list",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Cities",
            itemLabel: "city",
            titleKey: "city",
            unique: "slug",
            max: 40,
            item: [
              { kind: "text", key: "city", label: "City", required: true, help: "For example, Beaverton" },
              { kind: "slug", key: "slug", label: "Page address", prefix: "/service-areas/", help: "Changing it breaks the old link" },
              { kind: "text", key: "county", label: "County", help: "The page eyebrow: “Washington County, Oregon”" },
              { kind: "toggle", key: "primary", label: "Main city", help: "Highlighted in the service area block and weighted higher for search engines" },
              { kind: "textarea", key: "intro", label: "Text under the heading", rows: 3, required: true },
              { kind: "strings", key: "neighborhoods", label: "Neighborhoods", itemLabel: "neighborhood", max: 20 },
              { kind: "strings", key: "zips", label: "ZIP codes", itemLabel: "ZIP", max: 20 },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "faqs",
    title: "FAQ",
    description:
      "General questions: the /faq page, home (first 5), city pages (first 5) and service pages (first 3). Appliance-specific questions are in Services.",
    groups: [
      {
        title: "General questions",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Questions",
            itemLabel: "question",
            titleKey: "q",
            max: 40,
            item: [
              { kind: "text", key: "q", label: "Question", required: true },
              { kind: "textarea", key: "a", label: "Answer", rows: 4, required: true },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "reviews",
    title: "Reviews",
    description:
      "The /reviews page and the reviews block (first 3). Publish only real reviews, with the customer's permission: made-up reviews break FTC and Google rules. An empty list hides the reviews block.",
    groups: [
      {
        title: "Customer reviews",
        description: "These are layout samples for now. Replace them with real reviews or delete them before launch.",
        fields: [
          {
            kind: "list",
            key: "items",
            label: "Reviews",
            itemLabel: "review",
            titleKey: "author",
            max: 60,
            item: [
              { kind: "text", key: "author", label: "Customer name", required: true, help: "As in the original, e.g. Sarah M." },
              { kind: "text", key: "location", label: "City", help: "For example, Hillsboro, OR" },
              { kind: "number", key: "rating", label: "Rating, stars", min: 1, max: 5 },
              {
                kind: "select",
                key: "source",
                label: "Source",
                options: ["Google", "Yelp", "Facebook", "Nextdoor"].map((v) => ({ value: v, label: v })),
              },
              { kind: "textarea", key: "text", label: "Review text", rows: 4, required: true },
              { kind: "text", key: "service", label: "Service", help: "Optional, e.g. Refrigerator Repair" },
            ],
          },
        ],
      },
    ],
  },
];

sections.push({
  key: "integrations",
  title: "Integrations",
  description:
    "Analytics, ads, online booking and lead emails. An empty field falls back to the server setting (.env). API keys and passwords stay on the server.",
  groups: [
    {
      title: "Analytics & ads",
      description: "With a GTM container, GA4, Google Ads and Meta Pixel are expected to be set up inside GTM, and the IDs below are not loaded separately.",
      fields: [
        { kind: "text", key: "gtmId", label: "Google Tag Manager ID", placeholder: "GTM-XXXXXXX", pattern: "GTM-[A-Z0-9]{4,12}", patternError: "Looks like GTM-XXXXXXX" },
        { kind: "text", key: "ga4Id", label: "GA4 measurement ID", placeholder: "G-XXXXXXXXXX", pattern: "G-[A-Z0-9]{4,15}", patternError: "Looks like G-XXXXXXXXXX" },
        { kind: "text", key: "googleAdsId", label: "Google Ads ID", placeholder: "AW-123456789", pattern: "AW-\\d{6,15}", patternError: "Looks like AW-123456789" },
        {
          kind: "text",
          key: "googleAdsLeadLabel",
          label: "Google Ads lead conversion label",
          help: "The part after the slash in send_to: AW-123456789/AbC-dEfGhIjK",
          pattern: "[\\w-]{4,40}",
          patternError: "Letters, digits, - and _ only",
        },
        { kind: "text", key: "metaPixelId", label: "Meta Pixel ID", placeholder: "123456789012345", pattern: "\\d{6,20}", patternError: "Digits only" },
        {
          kind: "text",
          key: "googleSiteVerification",
          label: "Google Search Console verification",
          help: "Only the content value of the HTML tag method",
          pattern: "[\\w-]{10,100}",
          patternError: "Letters, digits, - and _ only",
        },
      ],
    },
    {
      title: "Online booking",
      fields: [
        {
          kind: "url",
          key: "bookingUrl",
          label: "Booking widget link",
          help: "From Housecall Pro, Jobber and similar. If set, the /book page shows this widget instead of the site form",
        },
      ],
    },
    {
      title: "Lead emails",
      description: "Sending needs RESEND_API_KEY on the server. Every lead is saved in Leads either way.",
      fields: [
        {
          kind: "text",
          key: "leadEmail",
          label: "Send new leads to",
          help: "One or more emails separated by commas",
          max: 500,
          pattern: "[^\\s@,]+@[^\\s@,]+\\.[^\\s@,]+(\\s*,\\s*[^\\s@,]+@[^\\s@,]+\\.[^\\s@,]+)*",
          patternError: "Emails separated by commas",
        },
      ],
    },
  ],
});

export function getSectionDef(key: string) {
  return sections.find((s) => s.key === key);
}

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const out = Array.isArray(obj) ? ([...obj] as unknown as T) : { ...obj };
  let cur = out as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const next = cur[keys[i]];
    cur[keys[i]] = next && typeof next === "object" ? { ...(next as object) } : {};
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
  return out;
}

export function mergeDeep<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return (typeof over === typeof base && Array.isArray(over) === Array.isArray(base) ? over : base) as T;
  }
  if (typeof over !== "object" || Array.isArray(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(out)) out[k] = mergeDeep(out[k], (over as Record<string, unknown>)[k]);
  return out as T;
}

export function parsePhone(input: string) {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return null;
  return {
    display: `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`,
    href: `tel:+1${d}`,
    e164: `+1${d}`,
  };
}

export type FieldErrors = Record<string, string>;

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function validateSection(def: SectionDef, input: unknown): { value: Record<string, unknown>; errors: FieldErrors } {
  const errors: FieldErrors = {};
  let value: Record<string, unknown> = structuredClone(defaults[def.key]) as Record<string, unknown>;
  for (const g of def.groups) {
    for (const f of g.fields) value = setPath(value, f.key, coerce(f, getPath(input, f.key), f.key, errors));
  }
  return { value, errors };
}

function coerce(f: Field, raw: unknown, path: string, errors: FieldErrors): unknown {
  const str = (max = 2000) => {
    const s = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "";
    if (s.length > max) errors[path] = `At most ${max} characters`;
    return s.slice(0, max);
  };
  switch (f.kind) {
    case "text": {
      const s = str(f.max ?? 300);
      if (f.required && !s) errors[path] = "Required";
      else if (s && f.pattern && !new RegExp(`^(?:${f.pattern})$`).test(s)) errors[path] = f.patternError ?? "Invalid format";
      return s;
    }
    case "textarea": {
      const s = str(f.max ?? 5000);
      if (f.required && !s) errors[path] = "Required";
      return s;
    }
    case "number": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) {
        errors[path] = "Enter a number";
        return 0;
      }
      if ((f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max)) errors[path] = `From ${f.min ?? "−∞"} to ${f.max ?? "∞"}`;
      return n;
    }
    case "toggle":
      return raw === true;
    case "phone": {
      const p = parsePhone(str(40));
      if (!p) errors[path] = "Needs a 10-digit number, e.g. (503) 555-0142";
      return p ? p.display : str(40);
    }
    case "email": {
      const s = str(200);
      if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) errors[path] = "Invalid email";
      return s;
    }
    case "url": {
      const s = str(500);
      if (s && !/^https?:\/\/\S+$/i.test(s)) errors[path] = "The link must start with https://";
      return s;
    }
    case "image": {
      const s = str(300);
      if (s && !/^\/(uploads|images)\/[\w.\-/]+$/.test(s)) errors[path] = "Invalid image path";
      return s;
    }
    case "icon":
      return (iconNames as readonly string[]).includes(raw as string) ? raw : iconNames[0];
    case "select":
      return f.options.some((o) => o.value === raw) ? raw : f.options[0].value;
    case "slug": {
      const s = slugify(str(80));
      if (!s) errors[path] = "Required";
      return s;
    }
    case "strings": {
      const arr = Array.isArray(raw) ? raw : [];
      const out = arr.map((v) => (typeof v === "string" ? v.trim().slice(0, 5000) : "")).filter(Boolean);
      return out.slice(0, f.max ?? 50);
    }
    case "list": {
      const arr = Array.isArray(raw) ? raw.slice(0, f.max ?? 50) : [];
      const out = arr.map((item, i) => {
        let o: Record<string, unknown> = {};
        for (const sub of f.item) o = setPath(o, sub.key, coerce(sub, getPath(item, sub.key), `${path}.${i}.${sub.key}`, errors));
        return o;
      });
      if (f.unique) {
        const seen = new Set<unknown>();
        out.forEach((o, i) => {
          const v = getPath(o, f.unique!);
          if (v && seen.has(v)) errors[`${path}.${i}.${f.unique}`] ??= "This value is already in the list";
          seen.add(v);
        });
      }
      return out;
    }
  }
}
