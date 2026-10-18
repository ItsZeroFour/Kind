export type Area = {
  slug: string;
  city: string;
  county: string;
  zips: string[];
  neighborhoods: string[];
  intro: string;
  primary?: boolean;
};

export const defaultAreas: Area[] = [
  {
    slug: "hillsboro",
    city: "Hillsboro",
    county: "Washington County",
    zips: ["97123", "97124", "97006"],
    neighborhoods: ["Orenco", "Tanasbourne", "AmberGlen", "South Hillsboro", "Reedville", "Downtown Hillsboro", "Witch Hazel"],
    intro:
      "Hillsboro is home base for Kind Appliance Repair. From Orenco Station apartments to new builds in South Hillsboro, we're usually just minutes away, which means faster appointments for you.",
    primary: true,
  },
  {
    slug: "beaverton",
    city: "Beaverton",
    county: "Washington County",
    zips: ["97005", "97006", "97007", "97008", "97078"],
    neighborhoods: ["Cedar Hills", "Murrayhill", "Sexton Mountain", "Bethany", "Cooper Mountain", "Central Beaverton", "Raleigh Hills"],
    intro:
      "We repair appliances in homes and businesses across Beaverton, from Cedar Hills and Bethany to Murrayhill and Cooper Mountain, with same-day and next-day visits available most weeks.",
    primary: true,
  },
  {
    slug: "aloha",
    city: "Aloha",
    county: "Washington County",
    zips: ["97003", "97006", "97007", "97078"],
    neighborhoods: ["Reedville", "Farmington", "Tualatin Valley Hwy corridor"],
    intro: "Aloha sits right between our Hillsboro and Beaverton routes, so getting a technician to your door is quick and easy.",
  },
  {
    slug: "tigard",
    city: "Tigard",
    county: "Washington County",
    zips: ["97223", "97224"],
    neighborhoods: ["Bull Mountain", "Summerfield", "Metzger", "Downtown Tigard"],
    intro: "From Bull Mountain to Summerfield, Tigard homeowners and businesses trust us for honest diagnostics and lasting repairs.",
  },
  {
    slug: "forest-grove",
    city: "Forest Grove",
    county: "Washington County",
    zips: ["97116"],
    neighborhoods: ["Downtown Forest Grove", "Thatcher", "Gales Creek area"],
    intro: "We extend our West Side service to Forest Grove, helping households and local businesses keep their appliances running.",
  },
  {
    slug: "cornelius",
    city: "Cornelius",
    county: "Washington County",
    zips: ["97113"],
    neighborhoods: ["Downtown Cornelius", "Council Creek"],
    intro: "Cornelius is just down the road from Hillsboro, close enough for fast scheduling on every type of home appliance repair.",
  },
  {
    slug: "tualatin",
    city: "Tualatin",
    county: "Washington County",
    zips: ["97062"],
    neighborhoods: ["Bridgeport", "Tualatin Commons", "Ibach"],
    intro: "Tualatin homes and commercial kitchens get the same upfront pricing and careful workmanship we bring to every call.",
  },
  {
    slug: "portland-west-side",
    city: "Portland (West Side)",
    county: "Multnomah & Washington County",
    zips: ["97225", "97229", "97221", "97219"],
    neighborhoods: ["Bethany", "Cedar Mill", "Raleigh Hills", "Hillsdale", "West Slope"],
    intro: "We serve Portland's West Side neighborhoods, including Cedar Mill, Bethany, West Slope and Raleigh Hills, for residential and commercial repairs.",
  },
];
