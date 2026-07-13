export type Category =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "specialized"
  | "references";

export type Book = {
  id: string;
  title: string;
  author: string;
  language: string;
  category: Category;
  edition: string;
  driveUrl: string;
  coverImage: string;
};

export type LanguageMeta = {
  id: string;
  label: string;
  blurb: string;
};

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "specialized", label: "Specialized" },
  { id: "references", label: "References" },
];

export const CATEGORY_FROM_HEADING: Record<string, Category> = {
  "for beginners": "beginner",
  "for intermediate developers": "intermediate",
  "for advanced programmers": "advanced",
  "for specialized fields": "specialized",
  "comprehensive references": "references",
};
