export const priceSegments = ["maintenance", "residential", "commercial", "premium"] as const;
export type PriceSegment = (typeof priceSegments)[number];

export const priceIcons = [
  "refrigerator", "washer", "dryer", "dishwasher", "oven", "cooktop", "range", "hood", "microwave",
  "icemaker", "freezer", "install", "cleaning", "inspection", "premium",
] as const;
export type PriceIcon = (typeof priceIcons)[number];

export type PriceItem = { name: string; detail: string; price: number; note: string };

export type PriceCategory = {
  title: string;
  slug: string;
  segment: PriceSegment;
  icon: PriceIcon;
  /** Service page slugs where this category is shown */
  services: string[];
  intro: string;
  items: PriceItem[];
};

const item = (name: string, price: number, detail = "", note = ""): PriceItem => ({ name, detail, price, note });

const ADDON = "Add-on with a repair";
const LABOR = "Labor only";

const dishwasher = [
  item("Circulation pump or motor repair or replacement", 449),
  item("Clogged drain hose cleaning or replacement", 320),
  item("Control board, user interface or timer", 389, "Repair or replacement"),
  item("Door lock and latch repair or replacement", 346),
  item("Drain pump repair or replacement", 409),
  item("Thermostat or sensor replacement", 348),
  item("Water valve repair or replacement", 346),
];

const dryer = [
  item("Control board, user interface or timer", 378, "Repair or replacement"),
  item("Thermostat or sensor replacement", 379),
  item("Ignitor or heating element replacement", 399),
  item("Door lock repair or replacement", 369),
  item("Motor repair or replacement", 679),
  item("Lint cleaning & roller lubrication", 199, "", ADDON),
];

const range = [
  item("Burner ignitor", 379, "Repair, cleaning or replacement"),
  item("Control board or user interface replacement", 579),
  item("Gas pressure regulator replacement", 470),
  item("Thermostat or sensor replacement", 419, "Thermostat, thermocouple, limit thermostat or sensor"),
];

const hood = [
  item("Blower / motor replacement", 590),
  item("Control board or user interface replacement", 440),
  item("Range hood reprogramming", 339),
];

const commercialCooling = [
  item("Compressor replacement", 890),
  item("Control board or user interface replacement", 410),
  item("Freon charge", 490),
  item("Sensor or switch replacement", 390),
  item("Water valve replacement", 379),
  item("Pipes & filters cleaning", 389),
];

export const defaultPriceCategories: PriceCategory[] = [
  // Maintenance & cleaning: shown as package cards
  {
    title: "Fridge Coil & Dryer Cleaning",
    slug: "coil-dryer-cleaning",
    segment: "maintenance",
    icon: "cleaning",
    services: ["refrigerator-repair", "dryer-repair"],
    intro: "Prevent fires, reduce energy bills and extend appliance life.",
    items: [item("Fridge coil & dryer cleaning service", 199, "Refrigerator condenser coil cleaning\nDryer lint and duct cleaning")],
  },
  {
    title: "Maintenance & Safety Inspection",
    slug: "maintenance-inspection",
    segment: "maintenance",
    icon: "inspection",
    services: [],
    intro: "A complete check-up of the appliances in your home.",
    items: [
      item(
        "Complete appliance maintenance & safety inspection",
        299,
        "Refrigerator condenser coil cleaning\nDryer duct cleaning\nInspection of all full-size appliances (small units excluded)\nDetailed condition report",
        "Most popular",
      ),
    ],
  },
  {
    title: "Appliance & HVAC Maintenance",
    slug: "appliance-hvac-maintenance",
    segment: "maintenance",
    icon: "premium",
    services: [],
    intro: "Appliances and your HVAC system, in one visit.",
    items: [
      item(
        "Complete appliance & HVAC maintenance and safety inspection",
        399,
        "Everything in the Maintenance & Safety Inspection\nHVAC maintenance and safety inspection",
      ),
    ],
  },

  // Residential repair
  {
    title: "Refrigerator, Freezer & Wine Cooler",
    slug: "refrigerator",
    segment: "residential",
    icon: "refrigerator",
    services: ["refrigerator-repair", "freezer-repair"],
    intro: "",
    items: [
      item("Control board, user interface or timer", 425, "Repair or replacement"),
      item("Door seal replacement", 482, "One or more doors"),
      item("Evaporator fan replacement", 429, "Freezer or fresh-food section"),
      item("Condenser fan replacement", 419),
      item("Thermostat or sensor replacement", 384, "No sealed-system work"),
      item("Compressor replacement", 1490, "", LABOR),
      item("Leak repair & Freon charge", 689, "", LABOR),
      item("Condenser coil cleaning", 250, "", ADDON),
    ],
  },
  {
    title: "Washer",
    slug: "washer",
    segment: "residential",
    icon: "washer",
    services: ["washer-repair"],
    intro: "",
    items: [
      item("Capacitor replacement", 446),
      item("Control board, user interface or timer", 439, "Repair or replacement"),
      item("Door lock or lid latch replacement", 416),
      item("Drain pump repair or replacement", 439),
      item("Motor repair or replacement", 679),
      item("Pressure or other sensor replacement", 426),
      item("Water valve replacement", 389, "One or more valves"),
    ],
  },
  {
    title: "Dryer",
    slug: "dryer",
    segment: "residential",
    icon: "dryer",
    services: ["dryer-repair"],
    intro: "",
    items: dryer,
  },
  {
    title: "Dishwasher",
    slug: "dishwasher",
    segment: "residential",
    icon: "dishwasher",
    services: ["dishwasher-repair"],
    intro: "",
    items: dishwasher,
  },
  {
    title: "Range",
    slug: "range",
    segment: "residential",
    icon: "range",
    services: ["oven-stove-repair"],
    intro: "",
    items: range,
  },
  {
    title: "Cooktop",
    slug: "cooktop",
    segment: "residential",
    icon: "cooktop",
    services: ["oven-stove-repair"],
    intro: "",
    items: [
      item("Burner spark ignitor replacement", 299),
      item("Burner or coil repair, cleaning or replacement", 289),
      item("Control board or user interface replacement", 319),
      item("Gas pressure regulator replacement", 330),
      item("Glass cooktop replacement", 345),
      item("Spark module replacement", 290),
      item("Thermostat or sensor replacement", 310, "Thermostat, thermocouple, limit thermostat or sensor"),
    ],
  },
  {
    title: "Oven & Grill",
    slug: "oven",
    segment: "residential",
    icon: "oven",
    services: ["oven-stove-repair"],
    intro: "Priced for your model after diagnosis.",
    items: [
      item("Control board or user interface", 0, "Repair or replacement"),
      item("Cooling fan", 0, "Repair or replacement"),
      item("Oven door repair", 0),
      item("Gas pressure regulator", 0, "Repair or replacement"),
      item("Ignitor or bake element", 0, "Repair or replacement"),
      item("Thermostat or sensors", 0),
    ],
  },
  {
    title: "Range Hood",
    slug: "range-hood",
    segment: "residential",
    icon: "hood",
    services: ["other-appliance-repair"],
    intro: "",
    items: hood,
  },

  // Commercial
  {
    title: "Appliance Installation",
    slug: "installation",
    segment: "commercial",
    icon: "install",
    services: [],
    intro: "Professional installation, one flat price per appliance.",
    items: [
      item("Washer & dryer installation", 299),
      item("Dishwasher installation", 299),
      item("Gas or electric oven installation", 299),
      item("Cooktop installation", 299),
      item("Range hood installation", 299),
      item("Built-in microwave installation", 299),
    ],
  },
  {
    title: "Commercial Refrigeration",
    slug: "commercial-refrigeration",
    segment: "commercial",
    icon: "refrigerator",
    services: [],
    intro: "",
    items: commercialCooling,
  },
  {
    title: "Commercial Ice Maker",
    slug: "commercial-ice-maker",
    segment: "commercial",
    icon: "icemaker",
    services: ["ice-maker-repair"],
    intro: "",
    items: commercialCooling,
  },
  {
    title: "Commercial Dishwasher",
    slug: "commercial-dishwasher",
    segment: "commercial",
    icon: "dishwasher",
    services: [],
    intro: "",
    items: dishwasher,
  },
  {
    title: "Commercial Dryer",
    slug: "commercial-dryer",
    segment: "commercial",
    icon: "dryer",
    services: [],
    intro: "",
    items: dryer,
  },
  {
    title: "Commercial Range",
    slug: "commercial-range",
    segment: "commercial",
    icon: "range",
    services: [],
    intro: "",
    items: range,
  },
  {
    title: "Commercial Range Hood",
    slug: "commercial-range-hood",
    segment: "commercial",
    icon: "hood",
    services: [],
    intro: "",
    items: hood,
  },

  // High-end
  {
    title: "High-End & Built-In Appliances",
    slug: "high-end",
    segment: "premium",
    icon: "premium",
    services: [],
    intro: "",
    items: ["Refrigerator", "Range", "Oven", "Cooktop", "Range hood", "Dishwasher", "Washer", "Dryer", "Microwave"].map((n) => item(n, 0)),
  },
];

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const fromPrice = (c: Pick<PriceCategory, "items">) => {
  const prices = c.items.filter((i) => !/add-on/i.test(i.note)).map((i) => i.price).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : 0;
};
