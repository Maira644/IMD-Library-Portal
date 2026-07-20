import { Link } from "react-router-dom";
import { Search, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import type { Book } from "@/types";
import type { Thesis } from "@/types";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { mockBooks } from "@/data/mockBooks";
import { mockThesis } from "@/data/mockThesis";
import { mockAnnouncements } from "@/data/mockAnnouncements";
import { mockCategories } from "@/data/mockCategories";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchTracker } from "@/contexts/SearchContext";
import { useState } from "react";

export function StudentDashboard() {
  const { user } = useAuth();
  const { track } = useSearchTracker();
  const [q, setQ] = useState("");
  const latestBooks = mockBooks.slice(0, 5);
  const latestThesis = mockThesis.slice(0, 5);
  const popular = [...mockBooks].sort((a, b) => b.views - a.views).slice(0, 5);
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
          <form className="mt-5 flex max-w-2xl items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (q) track(q); }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try 'algorithms' or 'thesis on AI'…" className="h-11 pl-9 text-foreground" />
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {mockCategories.slice(0, 6).map((c) => (
              <Badge key={c.id} variant="secondary" className="bg-white/15 text-primary-foreground hover:bg-white/25">
                {c.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="mt-8">
        <SectionHeader icon={BookOpen} title="Latest books" href="/student/books" />
        <DataTable data={latestBooks} columns={bookColumns} searchKeys={["title", "author", "category"]} />
      </section>

      <section className="mt-8">
        <SectionHeader icon={GraduationCap} title="Latest thesis" href="/student/thesis" />
        <DataTable data={latestThesis} columns={thesisColumns} searchKeys={["title", "department"]} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeader icon={TrendingUp} title="Popular resources" />
          <Card>
            <CardContent className="divide-y p-0">
              {popular.map((b) => (
                <Link key={b.id} to={`/student/books/${b.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div className="min-w-0"><p className="truncate text-sm font-medium">{b.title}</p><p className="truncate text-xs text-muted-foreground">{b.author}</p></div>
                  <Badge variant="secondary">{b.views} views</Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <SectionHeader icon={TrendingUp} title="Announcements" href="/student/announcements" />
          <div className="space-y-3">
            {mockAnnouncements.slice(0, 3).map((a) => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader icon={TrendingUp} title="Categories" />
        <Card>
          <CardContent className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
            {mockCategories.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm font-medium">{c.name}</span>
                <Badge variant="outline">{c.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
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
