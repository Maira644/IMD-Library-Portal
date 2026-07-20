import { useMemo, useState } from "react";
import { Plus, List, Filter } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { BookForm } from "@/components/book/BookForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { mockBooks } from "@/data/mockBooks";
import { mockCategories } from "@/data/mockCategories";
import { useSearchTracker } from "@/contexts/SearchContext";
import type { Book } from "@/types";
import { toast } from "sonner";

export function BooksPage({ hrefBase, canManage }: { hrefBase: string; canManage: boolean }) {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "views">("newest");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { track } = useSearchTracker();

  const filtered = useMemo(() => {
    let list = books;
    if (category !== "all") list = list.filter((b) => b.category === category);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(n) ||
          b.author.toLowerCase().includes(n) ||
          b.keywords.some((k) => k.toLowerCase().includes(n)),
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
    { key: "id", header: "ID", sortable: true, className: "w-28" },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (b) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{b.title}</p>
          <p className="truncate text-xs text-muted-foreground">{b.author}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (b) => <Badge variant="secondary">{b.category}</Badge> },
    { key: "publicationYear", header: "Year", sortable: true },
    { key: "publisher", header: "Publisher" },
    {
      key: "digitalCopy",
      header: "Digital",
      render: (b) => (b.digitalCopy ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>),
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (b) =>
        canManage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setEditing(b); setOpenForm(true); }}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeletingId(b.id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Books"
        description={canManage ? "Manage the book catalog for students." : "Browse the university book catalog."}
        actions={
          canManage && (
            <Button onClick={() => { setEditing(undefined); setOpenForm(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add book
            </Button>
          )
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          placeholder="Search books, authors, keywords…"
          value={q}
          onChange={(e) => { setQ(e.target.value); if (e.target.value) track(e.target.value); }}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {mockCategories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v: "newest" | "oldest" | "views") => setSort(v)}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="views">Most viewed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex rounded-md border border-border">
          {/* <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")}>
            <Grid3x3 className="h-4 w-4" />
          </Button> */}
          {/* <Button size="icon" variant={view === "table" ? "secondary" : "ghost"} onClick={() => setView("table")}>
            <List className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      {/* {view === "grid" ? (
        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((b) => <BookCard key={b.id} book={b} hrefBase={hrefBase} />)}
        </motion.div>
      ) : (
        <DataTable data={filtered} columns={columns} searchKeys={["title", "author", "category"]} />
      )} */}
      <DataTable data={filtered} columns={columns} searchKeys={["title", "author", "category"]} />
      <BookForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        onSubmit={(b) => {
          setBooks((prev) => {
            const exists = prev.some((x) => x.id === b.id);
            toast.success(exists ? "Book updated" : "Book created");
            return exists ? prev.map((x) => (x.id === b.id ? b : x)) : [b, ...prev];
          });
        }}
      />
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(v) => !v && setDeletingId(null)}
        title="Delete this book?"
        description="This will remove the book from the catalog."
        onConfirm={() => {
          setBooks((prev) => prev.filter((b) => b.id !== deletingId));
          toast.success("Book deleted");
          setDeletingId(null);
        }}
      />
    </div>
  );
}
