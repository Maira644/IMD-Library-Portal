import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Tags, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBooks } from "@/api/book";
import { getAllThesis } from "@/api/thesis";
import { getCategories } from "@/api/category";
import { toast } from "sonner";

interface DashboardBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  uploadDate: string;
}

interface DashboardThesis {
  id: string;
  title: string;
  studentNames: string[];
  coverUrl?: string;
  uploadDate: string;
}

type RecentUpload =
  | { type: "book"; id: string; title: string; subtitle: string; coverUrl?: string; uploadDate: string }
  | { type: "thesis"; id: string; title: string; subtitle: string; coverUrl?: string; uploadDate: string };

function isToday(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr.slice(0, 10) === today;
}

// Shimmer style shared by the stat cards and recent-uploads skeletons
function LibraryDashboardShimmerStyle() {
  return (
    <style>{`
      @keyframes lib-dash-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .lib-dash-shimmer {
        background: linear-gradient(
          90deg,
          hsl(var(--muted)) 25%,
          hsl(var(--muted-foreground) / 0.25) 50%,
          hsl(var(--muted)) 75%
        );
        background-size: 200% 100%;
        animation: lib-dash-shimmer 1.4s ease-in-out infinite;
      }
    `}</style>
  );
}

function RecentUploadsSkeleton() {
  return (
    <div className="divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <div className="h-12 w-9 shrink-0 rounded lib-dash-shimmer" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded lib-dash-shimmer" />
            <div className="h-3 w-1/3 rounded lib-dash-shimmer" />
          </div>
          <div className="h-5 w-14 shrink-0 rounded-full lib-dash-shimmer" />
          <div className="h-3 w-16 shrink-0 rounded lib-dash-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function LibraryDashboard() {
  const [books, setBooks] = useState<DashboardBook[]>([]);
  const [thesisList, setThesisList] = useState<DashboardThesis[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [todayUploads, setTodayUploads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [booksRes, thesisRes, categories] = await Promise.all([
          getAllBooks(),
          getAllThesis(),
          getCategories(),
        ]);

        const allBooks: DashboardBook[] = booksRes.books ?? [];
        const allThesis: DashboardThesis[] = thesisRes.thesis ?? [];

        setBooks(allBooks);
        setThesisList(allThesis);
        setCategoryCount(categories.length);

        const todaysBooks = allBooks.filter((b) => isToday(b.uploadDate)).length;
        const todaysThesis = allThesis.filter((t) => isToday(t.uploadDate)).length;
        setTodayUploads(todaysBooks + todaysThesis);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const recentUploads: RecentUpload[] = [
    ...books.map((b): RecentUpload => ({
      type: "book",
      id: b.id,
      title: b.title,
      subtitle: b.author,
      coverUrl: b.coverUrl,
      uploadDate: b.uploadDate,
    })),
    ...thesisList.map((t): RecentUpload => ({
      type: "thesis",
      id: t.id,
      title: t.title,
      subtitle: t.studentNames?.join(", ") ?? "",
      coverUrl: t.coverUrl,
      uploadDate: t.uploadDate,
    })),
  ]
    .sort((a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate))
    .slice(0, 5);

  return (
    <div>
      <LibraryDashboardShimmerStyle />
      <PageHeader title="Library dashboard" description="Manage the catalog and stay on top of your uploads." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 rounded lib-dash-shimmer" />
                  <div className="h-4 w-4 rounded lib-dash-shimmer" />
                </div>
                <div className="h-7 w-12 rounded lib-dash-shimmer" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard label="Books" value={books.length} icon={BookOpen} />
            <StatCard label="FYDP" value={thesisList.length} icon={GraduationCap} />
            <StatCard label="Categories" value={categoryCount} icon={Tags} />
            <StatCard label="Today's uploads" value={todayUploads} icon={Upload} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/books"><Plus className="mr-2 h-4 w-4" /> Add new book</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/thesis"><Plus className="mr-2 h-4 w-4" /> Add new FYDP</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/categories"><Plus className="mr-2 h-4 w-4" /> New category</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/announcements"><Plus className="mr-2 h-4 w-4" /> Post announcement</Link></Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {loading ? (
              <RecentUploadsSkeleton />
            ) : recentUploads.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No uploads yet.</p>
            ) : (
              recentUploads.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.type === "book" ? `/library/books/${item.id}` : `/library/thesis/${item.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-muted/50"
                >
                  {item.coverUrl ? (
                    <img src={item.coverUrl} alt="" className="h-12 w-9 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-9 rounded bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {item.type === "book" ? (
                      <BookOpen className="mr-1 h-3 w-3" />
                    ) : (
                      <GraduationCap className="mr-1 h-3 w-3" />
                    )}
                    {item.type === "book" ? "Book" : "FYDP"}
                  </Badge>
                  <span className="shrink-0 text-xs text-muted-foreground">{new Date(item.uploadDate).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}