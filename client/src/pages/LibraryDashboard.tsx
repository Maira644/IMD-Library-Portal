import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Tags, Upload, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBooks } from "@/data/mockBooks";
import { mockThesis } from "@/data/mockThesis";
import { mockCategories } from "@/data/mockCategories";

export function LibraryDashboard() {
  const recent = [...mockBooks].slice(0, 5);
  return (
    <div>
      <PageHeader title="Library dashboard" description="Manage the catalog and stay on top of your uploads." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Books" value={mockBooks.length} icon={BookOpen} />
        <StatCard label="Thesis" value={mockThesis.length} icon={GraduationCap} />
        <StatCard label="Categories" value={mockCategories.length} icon={Tags} />
        <StatCard label="Today's uploads" value={3} icon={Upload} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/books"><Plus className="mr-2 h-4 w-4" /> Add new book</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/thesis"><Plus className="mr-2 h-4 w-4" /> Add new thesis</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/categories"><Plus className="mr-2 h-4 w-4" /> New category</Link></Button>
            <Button asChild variant="secondary" className="justify-start"><Link to="/library/announcements"><Plus className="mr-2 h-4 w-4" /> Post announcement</Link></Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {recent.map((b) => (
              <Link key={b.id} to={`/library/books/${b.id}`} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                <img src={b.coverUrl} alt="" className="h-12 w-9 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.author}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(b.uploadDate).toLocaleDateString()}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
