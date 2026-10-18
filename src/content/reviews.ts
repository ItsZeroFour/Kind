export type Review = {
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  service?: string;
  source: "Google" | "Yelp" | "Facebook" | "Nextdoor";
};

export const defaultReviews: Review[] = [
  {
    author: "Sample Customer",
    location: "Hillsboro, OR",
    rating: 5,
    text: "Placeholder review. The technician showed up in the window they gave us, explained the problem with our refrigerator and had it cooling again the same afternoon.",
    service: "Refrigerator Repair",
    source: "Google",
  },
  {
    author: "Sample Customer",
    location: "Beaverton, OR",
    rating: 5,
    text: "Placeholder review. Clear pricing before any work started and our washer has been running perfectly since. Friendly, tidy and professional.",
    service: "Washer Repair",
    source: "Google",
  },
  {
    author: "Sample Restaurant Owner",
    location: "Tigard, OR",
    rating: 5,
    text: "Placeholder review. Our walk-in cooler went down on a Friday and they got us back up before dinner service. Our go-to for commercial repairs now.",
    service: "Commercial Repair",
    source: "Google",
  },
  {
    author: "Sample Customer",
    location: "Aloha, OR",
    rating: 5,
    text: "Placeholder review. They told us honestly the dishwasher was worth fixing rather than selling us a new one. Saved us hundreds.",
    service: "Dishwasher Repair",
    source: "Google",
  },
  {
    author: "Sample Property Manager",
    location: "Beaverton, OR",
    rating: 5,
    text: "Placeholder review. We manage several rentals and Kind makes it easy: quick scheduling, photos of the issue and clear invoices.",
    service: "Residential Repair",
    source: "Google",
  },
  {
    author: "Sample Customer",
    location: "Forest Grove, OR",
    rating: 5,
    text: "Placeholder review. Our gas dryer wasn't heating. The tech replaced the igniter and cleaned the vent in under an hour.",
    service: "Dryer Repair",
    source: "Google",
  },
];
