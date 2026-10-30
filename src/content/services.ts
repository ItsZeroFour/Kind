export type ServiceIcon =
  | "refrigerator"
  | "washer"
  | "dryer"
  | "dishwasher"
  | "oven"
  | "freezer"
  | "microwave"
  | "icemaker"
  | "other";

export type Service = {
  slug: string;
  name: string;
  appliance: string;
  icon: ServiceIcon;
  seoTitle: string;
  seoDescription: string;
  short: string;
  intro: string[];
  problems: string[];
  types: string[];
  faqs: { q: string; a: string }[];
  /** "maintenance" swaps the repair phrases for the maintenance template. Filled in by the store when missing. */
  pageType?: "repair" | "maintenance";
};

export const defaultServices: Service[] = [
  {
    slug: "refrigerator-repair",
    name: "Refrigerator Repair",
    appliance: "refrigerator",
    icon: "refrigerator",
    seoTitle: "Refrigerator Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Fridge not cooling, leaking or making noise? Kind Appliance Repair fixes all major refrigerator brands in Hillsboro, Beaverton and the West Side. Same-day appointments.",
    short: "Not cooling, leaking, noisy or icing up. We diagnose and fix it fast, before your food spoils.",
    intro: [
      "A warm refrigerator is an emergency in any household. Our technicians arrive with the most common parts on the truck, so many fridge repairs are finished in a single visit.",
      "We work on French-door, side-by-side, top- and bottom-freezer, built-in and counter-depth models, including the sealed system, controls and ice & water dispensers.",
    ],
    problems: [
      "Refrigerator not cooling or too warm",
      "Freezer working but fridge section warm",
      "Water leaking under or inside the fridge",
      "Loud buzzing, clicking or rattling",
      "Frost or ice build-up",
      "Ice maker or water dispenser not working",
      "Fridge running constantly",
      "Error codes on the display",
    ],
    types: ["French door", "Side-by-side", "Top freezer", "Bottom freezer", "Built-in", "Counter-depth", "Mini & bar fridges"],
    faqs: [
      {
        q: "Is it worth repairing my refrigerator or should I replace it?",
        a: "If your refrigerator is under about 10–12 years old and the repair costs less than half the price of a comparable new unit, repair is usually the smarter choice. We give you an honest recommendation after diagnosis, before any work begins.",
      },
      {
        q: "How long can food stay safe in a broken fridge?",
        a: "Keep the doors closed. A closed refrigerator keeps food safe for about 4 hours, and a full freezer for about 48 hours. Call us as early as possible so we can schedule the soonest available visit.",
      },
    ],
  },
  {
    slug: "washer-repair",
    name: "Washer Repair",
    appliance: "washer",
    icon: "washer",
    seoTitle: "Washer Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Washing machine won't drain, spin or start? Local washer repair for front-load and top-load machines in Hillsboro, Beaverton and nearby. Call Kind Appliance Repair.",
    short: "Won't drain, spin, start or stop leaking? We repair front-load and top-load washers of all major brands.",
    intro: [
      "A broken washer piles up laundry fast. We repair front-load, top-load and stackable washers, from drain pumps and lid switches to bearings, control boards and door locks.",
      "Our techs explain what failed and what the fix costs before we start, so there are no surprises on the invoice.",
    ],
    problems: [
      "Washer won't drain",
      "Not spinning or agitating",
      "Leaking water",
      "Door or lid won't lock or unlock",
      "Loud banging or shaking during spin",
      "Won't turn on or start",
      "Bad smell or mold in front-loader",
      "Error codes",
    ],
    types: ["Front-load", "Top-load", "High-efficiency (HE)", "Stackable", "Washer-dryer combo"],
    faqs: [
      {
        q: "Why does my front-load washer smell?",
        a: "Usually from detergent residue and moisture trapped in the door gasket or drain pump filter. We can clean or replace the gasket and filter and show you a simple routine to prevent it coming back.",
      },
      {
        q: "My washer stopped mid-cycle full of water. What should I do?",
        a: "Unplug the machine and don't force the door open. Most often it's a clogged drain pump or a failed pump motor, both routine repairs for our technicians.",
      },
    ],
  },
  {
    slug: "dryer-repair",
    name: "Dryer Repair",
    appliance: "dryer",
    icon: "dryer",
    seoTitle: "Dryer Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Dryer not heating or taking forever to dry? Gas and electric dryer repair in Hillsboro, Beaverton and the West Side. Upfront pricing from Kind Appliance Repair.",
    short: "No heat, long dry times, squeaking or not tumbling. Gas and electric dryer repair done right.",
    intro: [
      "When clothes come out damp after two cycles, the cause is usually a heating element, thermal fuse, igniter or a restricted vent. We find the real cause, not just the symptom.",
      "We service both gas and electric dryers and check venting on every call, because a clogged vent is the leading cause of dryer fires.",
    ],
    problems: [
      "Dryer not heating",
      "Takes too long to dry",
      "Drum not turning",
      "Squeaking, thumping or grinding",
      "Dryer won't start",
      "Shuts off too early",
      "Burning smell",
    ],
    types: ["Electric", "Gas", "Stackable", "Ventless / heat pump"],
    faqs: [
      {
        q: "How often should a dryer vent be cleaned?",
        a: "At least once a year, more often for large households. If drying times are getting longer, a restricted vent is a likely cause.",
      },
      {
        q: "Do you repair gas dryers?",
        a: "Yes. Our technicians repair gas dryers, including igniters, gas valve coils and flame sensors.",
      },
    ],
  },
  {
    slug: "dishwasher-repair",
    name: "Dishwasher Repair",
    appliance: "dishwasher",
    icon: "dishwasher",
    seoTitle: "Dishwasher Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Dishwasher not draining, cleaning or drying? Fast dishwasher repair in Hillsboro, Beaverton, Aloha and nearby. Book a technician with Kind Appliance Repair.",
    short: "Dirty dishes, standing water or leaks. We fix the problem and get your kitchen back to normal.",
    intro: [
      "Most dishwasher problems come down to a handful of parts: drain pumps, inlet valves, spray arms, door latches and control boards. Our technicians carry many of them on the truck.",
      "We repair built-in and drawer dishwashers from every major brand, including premium European models.",
    ],
    problems: [
      "Dishwasher not draining",
      "Dishes not getting clean",
      "Leaking onto the floor",
      "Not drying dishes",
      "Won't start or lights blinking",
      "Loud grinding or humming",
      "Door won't latch",
    ],
    types: ["Built-in", "Drawer", "Portable", "Panel-ready"],
    faqs: [
      {
        q: "Why is there water left in the bottom of my dishwasher?",
        a: "A small amount is normal. Standing water above the filter usually means a clogged filter, a kinked drain hose or a failing drain pump.",
      },
      {
        q: "Do you repair Bosch and Miele dishwashers?",
        a: "Yes. We service European brands including Bosch, Thermador, Miele and Fisher & Paykel, along with all major U.S. brands.",
      },
    ],
  },
  {
    slug: "oven-stove-repair",
    name: "Oven & Stove Repair",
    appliance: "oven or stove",
    icon: "oven",
    seoTitle: "Oven & Stove Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Oven not heating, burner won't light or temperature off? Gas and electric range, oven and cooktop repair in Hillsboro and Beaverton, OR.",
    short: "Ranges, wall ovens and cooktops, gas or electric. Uneven heat, dead burners or faulty igniters.",
    intro: [
      "We repair freestanding ranges, slide-in ranges, wall ovens and cooktops, both gas and electric, including induction.",
      "Common fixes include bake and broil elements, igniters, temperature sensors, surface burners, control boards and door hinges.",
    ],
    problems: [
      "Oven not heating or heating unevenly",
      "Burner won't light or keeps clicking",
      "Temperature is off",
      "Self-clean issues or door locked",
      "Electric burner not working",
      "Control panel or touchpad not responding",
      "Gas smell (call your gas utility first)",
    ],
    types: ["Gas ranges", "Electric ranges", "Wall ovens", "Cooktops", "Induction", "Double ovens"],
    faqs: [
      {
        q: "I smell gas near my stove. Should I call you?",
        a: "Leave the house and call NW Natural or 911 first. Once the utility confirms it's safe, we can diagnose and repair the appliance.",
      },
      {
        q: "Why does my gas burner keep clicking?",
        a: "Moisture, food debris on the igniter or a failing spark module are the usual causes. It's typically a quick and affordable repair.",
      },
    ],
  },
  {
    slug: "freezer-repair",
    name: "Freezer Repair",
    appliance: "freezer",
    icon: "freezer",
    seoTitle: "Freezer Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Upright or chest freezer not freezing? Freezer repair in Hillsboro, Beaverton and surrounding areas. Fast service from Kind Appliance Repair.",
    short: "Upright and chest freezers not freezing, frosting up or running nonstop.",
    intro: [
      "A failing freezer can cost you hundreds of dollars in food. We repair standalone upright and chest freezers as well as the freezer section of your refrigerator.",
      "Common causes include defrost system failures, evaporator fan motors, start relays, thermostats and door seals.",
    ],
    problems: [
      "Freezer not freezing",
      "Heavy frost or ice build-up",
      "Running constantly",
      "Loud or unusual noises",
      "Door not sealing",
      "Freezer completely dead",
    ],
    types: ["Upright", "Chest", "Built-in", "Commercial reach-in"],
    faqs: [
      {
        q: "Why is my freezer frosting up?",
        a: "Usually a worn door gasket letting in warm air or a failed defrost heater, timer or thermostat. We'll find the cause and fix it.",
      },
    ],
  },
  {
    slug: "microwave-repair",
    name: "Microwave Repair",
    appliance: "microwave",
    icon: "microwave",
    seoTitle: "Microwave Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Over-the-range and built-in microwave repair in Hillsboro and Beaverton. Not heating, sparking or turntable stopped? Call Kind Appliance Repair.",
    short: "Over-the-range and built-in microwaves that won't heat, spark or respond.",
    intro: [
      "We repair over-the-range, built-in and drawer microwaves. They're often worth fixing because replacement means re-mounting and re-venting.",
      "Microwaves store high voltage even when unplugged, so please leave internal repairs to a trained technician.",
    ],
    problems: [
      "Runs but doesn't heat",
      "Sparking or arcing",
      "Turntable not turning",
      "Keypad not responding",
      "Exhaust fan or light not working",
      "Door switch problems",
    ],
    types: ["Over-the-range", "Built-in", "Microwave drawer", "Convection microwave"],
    faqs: [
      {
        q: "Do you repair countertop microwaves?",
        a: "Countertop units are usually cheaper to replace than repair. We focus on over-the-range, built-in and drawer models, where repair makes financial sense.",
      },
    ],
  },
  {
    slug: "ice-maker-repair",
    name: "Ice Maker Repair",
    appliance: "ice maker",
    icon: "icemaker",
    seoTitle: "Ice Maker Repair in Hillsboro & Beaverton, OR",
    seoDescription:
      "Ice maker not making ice or leaking? Built-in, under-counter and refrigerator ice maker repair in Hillsboro, Beaverton and the West Side.",
    short: "Refrigerator ice makers and standalone under-counter units. No ice, small cubes or leaks.",
    intro: [
      "We fix refrigerator ice makers and standalone under-counter ice machines, from water inlet valves and fill tubes to ice maker modules and frozen lines.",
      "For restaurants and offices, we also service commercial ice machines. See our commercial repair page.",
    ],
    problems: [
      "No ice production",
      "Small, hollow or misshapen cubes",
      "Ice maker leaking",
      "Water line frozen",
      "Ice tastes or smells bad",
      "Dispenser jammed",
    ],
    types: ["Refrigerator ice makers", "Under-counter ice makers", "Clear-ice machines", "Commercial ice machines"],
    faqs: [
      {
        q: "Why is my ice maker producing small cubes?",
        a: "Low water pressure, a clogged water filter or a partially frozen fill tube are the usual suspects. Start by replacing the water filter; if that doesn't help, we'll take it from there.",
      },
    ],
  },
  {
    slug: "other-appliance-repair",
    name: "Other Appliance Repair",
    appliance: "appliance",
    icon: "other",
    seoTitle: "Appliance Repair Services in Hillsboro & Beaverton, OR",
    seoDescription:
      "Wine coolers, range hoods, garbage disposals, trash compactors and more. If it plugs in, ask us. Appliance repair in Hillsboro, Beaverton and nearby.",
    short: "Wine coolers, range hoods, trash compactors, disposals and more. Just ask.",
    intro: [
      "Not every appliance fits neatly into a category. We also repair wine and beverage coolers, range hoods, trash compactors, garbage disposals, warming drawers and more.",
      "Tell us what you have and what's going on. If it's something we don't service, we'll tell you right away and point you in the right direction.",
    ],
    problems: [
      "Wine cooler not cooling",
      "Range hood fan or lights out",
      "Trash compactor jammed",
      "Garbage disposal humming or leaking",
      "Warming drawer not heating",
    ],
    types: ["Wine & beverage coolers", "Range hoods", "Trash compactors", "Garbage disposals", "Warming drawers"],
    faqs: [
      {
        q: "How do I know if you can fix my appliance?",
        a: "Send a quick request with the brand, model and problem, or just call. We'll tell you upfront whether it's something we service.",
      },
    ],
  },
];

export const defaultBrands = [
  "Whirlpool",
  "GE",
  "Samsung",
  "LG",
  "Frigidaire",
  "Maytag",
  "KitchenAid",
  "Bosch",
  "Kenmore",
  "Electrolux",
  "Thermador",
  "Sub-Zero",
  "Viking",
  "Wolf",
  "Miele",
  "Fisher & Paykel",
  "Amana",
  "JennAir",
  "Café",
  "Speed Queen",
];
