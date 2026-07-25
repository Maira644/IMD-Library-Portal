import { useParams } from "react-router-dom";
import { mockBooks } from "@/data/mockBooks";
import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { BookCard } from "@/components/book/BookCard";

const HREF_BASE = "/library/books";

export function InchargeBookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const book = mockBooks.find((b) => b.id === id);
  if (!book) {
    return <p className="text-center text-muted-foreground">Book not found.</p>;
  }
  const related = mockBooks.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 5);
  return (
    <ResourceDetail
      cover={book.coverUrl}
      title={book.title}
      subtitle={`by ${book.author} · ${book.publisher}`}
      meta={[
        { label: "Book ID", value: book.id },
        { label: "ISBN", value: book.isbn ?? "—" },
        { label: "Edition", value: book.edition ?? "—" },
        { label: "Publication year", value: book.publicationYear },
        { label: "Language", value: book.language },
        { label: "Category", value: book.category },
        { label: "Uploaded by", value: book.uploadedBy },
        { label: "Upload date", value: new Date(book.uploadDate).toLocaleDateString() },
        { label: "Physical copy", value: book.physicalCopy ? "Available" : "Not available" },
        { label: "Digital copy", value: book.digitalCopy ? "Available" : "Not available" },
      ]}
      description={book.description}
      keywords={book.keywords}
      pdfUrl={book.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((b) => <BookCard key={b.id} book={b} hrefBase={HREF_BASE} />)}
        </div>
      }
    />
  );
}