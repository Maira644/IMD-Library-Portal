import { useMemo, useState, useEffect } from "react";
import { Plus, Filter, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BookForm } from "@/components/book/BookForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSearchTracker } from "@/contexts/SearchContext";
import { toast } from "sonner";

import type { Book, Category } from "@/types";
import { getCategories } from "@/api/category";
import {
  getAllBooks,
  deleteBook,
} from "@/api/book";

const HREF_BASE = "/library/books";
const CAN_MANAGE = true;

export function InchargeBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "views">("newest");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { track } = useSearchTracker();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.books);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filtered = useMemo(() => {
    let list = books;

    if (category !== "all") {
      list = list.filter((b) => b.category === category);
    }

    if (q.trim()) {
      const n = q.toLowerCase();

      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(n) ||
          b.author.toLowerCase().includes(n) ||
          b.keywords.some((k) => k.toLowerCase().includes(n))
      );
    }

    return [...list].sort((a, b) => {
      if (sort === "views") return b.views - a.views;

      const av = new Date(a.uploadDate).getTime();
      const bv = new Date(b.uploadDate).getTime();

      return sort === "newest" ? bv - av : av - bv;
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
      render: (b) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{b.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {b.author}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (b) => <Badge variant="secondary">{b.category}</Badge>,
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
      render: (b) =>
        b.digitalCopy ? (
          <Badge>Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (b) =>
        CAN_MANAGE ? (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setEditing(b);
                    setTimeout(() => setOpenForm(true), 0);
                  }}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    setTimeout(() => setDeletingId(b.id), 0);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Books"
        description="Manage the book catalog for students."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setOpenForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add book
          </Button>
        }
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
          onValueChange={(v: "newest" | "oldest" | "views") => setSort(v)}
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

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["title", "author", "category"]}
        onRowClick={(book) => navigate(`${HREF_BASE}/${book.id}`)}
      />

      <BookForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        uploadedBy="Incharge"
        onSubmit={async () => {
          await fetchBooks();

          if (editing) {
            toast.success("Book updated successfully");
          } else {
            toast.success("Book created successfully");
          }

          setEditing(undefined);
        }}
      />

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Delete this book?"
        description="This will remove the book from the catalog."
        onConfirm={async () => {
          if (!deletingId) return;

          try {
            await deleteBook(deletingId);
            await fetchBooks();

            toast.success("Book deleted successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete book");
          }

          setDeletingId(null);
        }}
      />
    </div>
  );
}