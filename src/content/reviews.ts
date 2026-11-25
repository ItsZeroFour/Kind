export type Review = {
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  service?: string;
  source: "Google" | "Yelp" | "Facebook" | "Nextdoor";
};

// no fake sample reviews (google/ftc)
export const defaultReviews: Review[] = [];
