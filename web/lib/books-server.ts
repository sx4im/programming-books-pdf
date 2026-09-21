import booksJson from "../data/books.json";
import type { Book } from "./types";

const books = booksJson as Book[];

const byId = new Map(books.map((book) => [book.id, book]));

export function getAllBooks(): Book[] {
  return books;
}

export function getBookById(id: string): Book | undefined {
  return byId.get(id);
}
