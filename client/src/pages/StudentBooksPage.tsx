import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { mockBooks } from "@/data/mockBooks";
import { mockCategories } from "@/data/mockCategories";
import { useSearchTracker } from "@/contexts/SearchContext";
import type { Book } from "@/types";

const HREF_BASE = "/student/books";

export function StudentBooksPage() {
  const [books] = useState<Book[]>(mockBooks);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "views">("newest");
  const { track } = useSearchTracker();
  const navigate = useNavigate();

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
  ];

  return (
    <div>
      <PageHeader title="Books" description="Browse the university book catalog." />

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
        <div className="flex rounded-md border border-border" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["title", "author", "category"]}
        onRowClick={(book) => navigate(`${HREF_BASE}/${book.id}`)}
      />
    </div>
  );
}