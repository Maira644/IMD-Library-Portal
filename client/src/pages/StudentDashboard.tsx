import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, GraduationCap, TrendingUp, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import type { Book, Thesis, Announcement, Category } from "@/types";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { getAllBooks } from "@/api/book";
import { getAllThesis } from "@/api/thesis";
import { getAnnouncements } from "@/api/announcement";
import { getCategories } from "@/api/category";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchTracker } from "@/contexts/SearchContext";
import { toast } from "sonner";

function matchesQuery(text: string | undefined, q: string) {
  return !!text && text.toLowerCase().includes(q);
}

export function StudentDashboard() {
  const { user } = useAuth();
  const { track } = useSearchTracker();
  const [q, setQ] = useState("");

  const [books, setBooks] = useState<Book[]>([]);
  const [thesis, setThesis] = useState<Thesis[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [booksRes, thesisRes, announcementsData, categoriesData] = await Promise.all([
          getAllBooks(),
          getAllThesis(),
          getAnnouncements(),
          getCategories(),
        ]);

        setBooks(booksRes.books ?? []);
        setThesis(thesisRes.thesis ?? []);
        setAnnouncements(announcementsData ?? []);
        setCategories(categoriesData ?? []);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) track(trimmed);
  }

  function clearSearch() {
    setQ("");
  }

  const isSearching = q.trim().length > 0;
  const lowerQuery = q.trim().toLowerCase();

  const matchedBooks = isSearching
    ? books.filter(
        (b) =>
          matchesQuery(b.title, lowerQuery) ||
          matchesQuery(b.author, lowerQuery) ||
          matchesQuery(b.category, lowerQuery) ||
          b.keywords?.some((k) => matchesQuery(k, lowerQuery))
      )
    : [];

  const matchedThesis = isSearching
    ? thesis.filter(
        (t) =>
          matchesQuery(t.title, lowerQuery) ||
          matchesQuery(t.department, lowerQuery) ||
          t.studentNames?.some((n) => matchesQuery(n, lowerQuery)) ||
          t.keywords?.some((k) => matchesQuery(k, lowerQuery))
      )
    : [];

  const latestBooks = [...books]
    .sort((a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate))
    .slice(0, 5);

  const latestThesis = [...thesis]
    .sort((a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate))
    .slice(0, 5);

  const popular = [...books].sort((a, b) => b.views - a.views).slice(0, 5);

  const sortedAnnouncements = [...announcements].sort((a, b) =>
    a.pinned === b.pinned ? +new Date(b.createdAt) - +new Date(a.createdAt) : a.pinned ? -1 : 1
  );

  const bookColumns: DataTableColumn<Book>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (b) => (
        <Link to={`/student/books/${b.id}`} className="block min-w-0 hover:underline">
          <p className="truncate font-medium">{b.title}</p>
          <p className="truncate text-xs text-muted-foreground">{b.author}</p>
        </Link>
      ),
    },
    { key: "category", header: "Category", render: (b) => <Badge variant="secondary">{b.category}</Badge> },
    { key: "publicationYear", header: "Year", sortable: true },
    { key: "views", header: "Views", sortable: true },
  ];

  const thesisColumns: DataTableColumn<Thesis>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (t) => (
        <Link to={`/student/thesis/${t.id}`} className="block min-w-0 hover:underline">
          <p className="truncate font-medium">{t.title}</p>
          <p className="truncate text-xs text-muted-foreground">{t.studentNames.join(", ")}</p>
        </Link>
      ),
    },
    { key: "department", header: "Department", render: (t) => <Badge variant="secondary">{t.department}</Badge> },
    { key: "submissionYear", header: "Year", sortable: true },
    { key: "views", header: "Views", sortable: true },
  ];

  return (
    <div>
      <PageHeader title={`Welcome back, ${user?.name.split(" ")[0]}`} description="Discover the latest books, thesis, and announcements." />

      <Card className="border-none bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold">Find your next resource</h2>
          <p className="mt-1 text-primary-foreground/80">Search across books, thesis, and keywords.</p>
          <form className="mt-5 flex max-w-2xl items-center gap-2" onSubmit={handleSearch}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try 'algorithms' or 'thesis on AI'…" className="h-11 pl-9 text-foreground" />
            </div>
            {isSearching && (
              <Button type="button" variant="secondary" onClick={clearSearch}>
                <X className="mr-2 h-4 w-4" /> Clear
              </Button>
            )}
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 6).map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                onClick={() => {
                  setQ(c.name);
                  track(c.name);
                }}
                className="cursor-pointer bg-white/15 text-primary-foreground hover:bg-white/25"
              >
                {c.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {isSearching ? (
        <section className="mt-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Search results for &quot;{q}&quot;
            </h2>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="mr-2 h-4 w-4" /> Clear search
            </Button>
          </div>

          <div>
            <SectionHeader icon={BookOpen} title={`Books (${matchedBooks.length})`} />
            {matchedBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No books matched your search.</p>
            ) : (
              <DataTable data={matchedBooks} columns={bookColumns} searchKeys={["title", "author", "category"]} />
            )}
          </div>

          <div>
            <SectionHeader icon={GraduationCap} title={`Thesis (${matchedThesis.length})`} />
            {matchedThesis.length === 0 ? (
              <p className="text-sm text-muted-foreground">No thesis matched your search.</p>
            ) : (
              <DataTable data={matchedThesis} columns={thesisColumns} searchKeys={["title", "department"]} />
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="mt-8">
            <SectionHeader icon={BookOpen} title="Latest books" href="/student/books" />
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading books...</p>
            ) : (
              <DataTable data={latestBooks} columns={bookColumns} searchKeys={["title", "author", "category"]} />
            )}
          </section>

          <section className="mt-8">
            <SectionHeader icon={GraduationCap} title="Latest thesis" href="/student/thesis" />
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading thesis...</p>
            ) : (
              <DataTable data={latestThesis} columns={thesisColumns} searchKeys={["title", "department"]} />
            )}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeader icon={TrendingUp} title="Popular resources" />
              <Card>
                <CardContent className="divide-y p-0">
                  {loading ? (
                    <p className="p-4 text-sm text-muted-foreground">Loading...</p>
                  ) : popular.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No books yet.</p>
                  ) : (
                    popular.map((b) => (
                      <Link key={b.id} to={`/student/books/${b.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div className="min-w-0"><p className="truncate text-sm font-medium">{b.title}</p><p className="truncate text-xs text-muted-foreground">{b.author}</p></div>
                        <Badge variant="secondary">{b.views} views</Badge>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <SectionHeader icon={TrendingUp} title="Announcements" href="/student/announcements" />
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : sortedAnnouncements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No announcements yet.</p>
                ) : (
                  sortedAnnouncements.slice(0, 3).map((a) => <AnnouncementCard key={a.id} a={a} />)
                )}
              </div>
            </div>
          </section>

          <section className="mt-8">
            <SectionHeader icon={TrendingUp} title="Categories" />
            <Card>
              <CardContent className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories yet.</p>
                ) : (
                  categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <span className="text-sm font-medium">{c.name}</span>
                      <Badge variant="outline">{c.count}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, href }: { icon: React.ComponentType<{ className?: string }>; title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {href && <Link to={href} className="text-sm text-primary hover:underline">See all</Link>}
    </div>
  );
}