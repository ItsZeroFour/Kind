export type Review = {
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  service?: string;
  source: "Google" | "Yelp" | "Facebook" | "Nextdoor";
};

/** No sample reviews: invented reviews break Google and FTC rules, and a reset in the admin would bring them back. */
export const defaultReviews: Review[] = [];
