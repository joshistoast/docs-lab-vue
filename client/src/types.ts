export enum Rating {
  "PG" = "PG",
  "R" = "R",
  "X" = "X",
}
export interface Author {
  name: string;
  url: string;
}
export interface Tag {
  id: string;
  label: string;
}
export interface Comment {
  name: string;
  date: string;
  body: string;
}
export interface Story {
  id: string;
  title: string;
  author: Author;
  handle: string;
  url: string;
  rating: Rating;
  tags: Tag[];
  score: number;
  description: string;
  commentsCount: number;
  comments: Comment[];
  favoritesCount: number;
  publishedAt: string;
  updatedAt: string;
  storyHtml: string;
  [key: string]: any;
}
