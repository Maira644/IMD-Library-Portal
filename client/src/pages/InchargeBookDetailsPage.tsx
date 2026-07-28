import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { BookCard } from "@/components/book/BookCard";

import {
  getBookById,
  getAllBooks,
  incrementBookView,
} from "@/api/book";
import type { Book } from "@/types";

const HREF_BASE = "/library/books";

export function InchargeBookDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const viewCounted = useRef(false);

  useEffect(() => {
  if (!id) return;

  if (viewCounted.current) return;

  viewCounted.current = true;

  fetchBook();
}, [id]);

  async function fetchBook() {
    try {
      if (!id) return;

await incrementBookView(id);

const selectedBook = await getBookById(id);
      setBook(selectedBook);

      const response = await getAllBooks();

      const relatedBooks = response.books.filter(
        (b: Book) =>
          b.category === selectedBook.category &&
          b.id !== selectedBook.id
      );

      setRelated(relatedBooks.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  if (!book) {
    return (
      <p className="text-center text-muted-foreground">
        Book not found.
      </p>
    );
  }

  return (
    <ResourceDetail
      cover={book.coverUrl}
      title={book.title}
      subtitle={`by ${book.author} · ${book.publisher}`}
      meta={[
        { label: "Book ID", value: book.id ?? "—" },
        { label: "Edition", value: book.edition ?? "—" },
        { label: "Publication year", value: book.publicationYear ?? "—" },
        { label: "Category", value: book.category ?? "—" },
        { label: "Uploaded by", value: book.uploadedBy ?? "—" },
        {
          label: "Upload date",
          value: book.uploadDate
          ? new Date(book.uploadDate).toLocaleDateString()
          : "—",
        },
        {
          label: "Physical copy",
          value: book.physicalCopy ? "Available" : "Not available",
        },
        {
          label: "Digital copy",
          value: book.digitalCopy ? "Available" : "Not available",
        },
      ]}
      description=""
      keywords={book.keywords}
      pdfUrl={book.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((b) => (
            <BookCard
              key={b.id}
              book={b}
              hrefBase={HREF_BASE}
            />
          ))}
        </div>
      }
    />
  );
}