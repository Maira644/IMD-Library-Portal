import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Tags, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  uploadDate: string;
}

function isToday(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr.slice(0, 10) === today;
}

export function LibraryDashboard() {
  const [books, setBooks] = useState<DashboardBook[]>([]);
  const [thesisCount, setThesisCount] = useState(0);
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
        setThesisCount(allThesis.length);
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

  const recent = [...books]
    .sort((a, b) => +new Date(b.uploadDate) - +new Date(a.uploadDate))
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Library dashboard" description="Manage the catalog and stay on top of your uploads." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Books" value={loading ? "..." : books.length} icon={BookOpen} />
        <StatCard label="FYDP" value={loading ? "..." : thesisCount} icon={GraduationCap} />
        <StatCard label="Categories" value={loading ? "..." : categoryCount} icon={Tags} />
        <StatCard label="Today's uploads" value={loading ? "..." : todayUploads} icon={Upload} />
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
              <p className="p-4 text-sm text-muted-foreground">Loading...</p>
            ) : recent.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No books uploaded yet.</p>
            ) : (
              recent.map((b) => (
                <Link key={b.id} to={`/library/books/${b.id}`} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt="" className="h-12 w-9 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-9 rounded bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(b.uploadDate).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}