export interface NovelDetail {
  title: string;
  rating: { value: number; count: number };
  alternateNames: string[];
  author: string;
  genres: string[];
  status: string;
  publishers: string;
  tags: string[];
  year: number | null;
}
