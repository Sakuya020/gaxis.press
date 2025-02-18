export type CatalogueType = {
  title: string;
  image: null | string;
  status: "available" | "sold out" | "coming soon";
  date: string;
  no: number;
  availableAt: null | { name: string; url: string }[];
  collectionAt: null | { name: string; url: string }[];
  thumbnail: null | string;
};

export type EventType = {
  date: string;
  description: any;
};
