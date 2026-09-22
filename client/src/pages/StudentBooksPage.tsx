import { useMemo, useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/tables/DataTable";

import { Badge } from "@/components/ui/badge";
import { useSearchTracker } from "@/contexts/SearchContext";

import { getAllBooks } from "@/api/book";
import { getCategories } from "@/api/category";

import type { Book, Category } from "@/types";

const HREF_BASE = "/student/books";

// Skeleton loader shown while books are being fetched
function StudentBooksSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <style>{`
        @keyframes student-books-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .student-books-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted-foreground) / 0.25) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: student-books-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-center justify-center gap-2 py-6 border-b bg-muted/30">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading books...
        </span>
      </div>

      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-14 shrink-0 rounded student-books-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded student-books-shimmer" />
              <div className="h-3 w-1/3 rounded student-books-shimmer" />
            </div>
            <div className="h-5 w-20 shrink-0 rounded-full student-books-shimmer" />
            <div className="h-4 w-10 shrink-0 rounded student-books-shimmer" />
            <div className="h-4 w-24 shrink-0 rounded student-books-shimmer" />
            <div className="h-5 w-12 shrink-0 rounded-full student-books-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "views">("oldest");

  const { track } = useSearchTracker();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const response = await getAllBooks();
      setBooks(response.books);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  const filtered = useMemo(() => {
    let list = books;

    if (category !== "all") {
      list = list.filter((b) => b.category === category);
    }

    if (q.trim()) {
      const keyword = q.toLowerCase();

      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword) ||
          b.keywords.some((k) => k.toLowerCase().includes(keyword))
      );
    }

    return [...list].sort((a, b) => {
      if (sort === "views") {
        return b.views - a.views;
      }

      const aDate = new Date(a.uploadDate).getTime();
      const bDate = new Date(b.uploadDate).getTime();

      return sort === "newest" ? bDate - aDate : aDate - bDate;
    });
  }, [books, q, category, sort]);

  const columns: DataTableColumn<Book>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      className: "w-28",
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (book) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{book.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {book.author}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (book) => (
        <Badge variant="secondary">
          {book.category ?? "—"}
        </Badge>
      ),
    },
    {
      key: "publicationYear",
      header: "Year",
      sortable: true,
    },
    {
      key: "publisher",
      header: "Publisher",
    },
    {
      key: "digitalCopy",
      header: "Digital",
      render: (book) =>
        book.digitalCopy ? (
          <Badge>Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Books"
        description="Browse the university book catalog."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          placeholder="Search books, authors, keywords..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);

            if (e.target.value) {
              track(e.target.value);
            }
          }}
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>

            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value: "newest" | "oldest" | "views") =>
            setSort(value)
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="views">Most viewed</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-md border border-border" />
      </div>

      {loading ? (
        <StudentBooksSkeleton />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["title", "author", "category"]}
          onRowClick={(book) => navigate(`${HREF_BASE}/${book.id}`)}
        />
      )}
    </div>
  );
}