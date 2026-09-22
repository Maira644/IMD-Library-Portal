import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/tables/DataTable";
import type { Category } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { getCategories } from "@/api/category";

// Skeleton loader shown while categories are being fetched
function StudentCategoriesSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <style>{`
        @keyframes student-cat-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .student-cat-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted-foreground) / 0.25) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: student-cat-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-center justify-center gap-2 py-6 border-b bg-muted/30">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading categories...
        </span>
      </div>

      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-5 w-5 shrink-0 rounded student-cat-shimmer" />
            <div className="h-4 w-32 shrink-0 rounded student-cat-shimmer" />
            <div className="h-4 flex-1 rounded student-cat-shimmer" />
            <div className="h-6 w-12 shrink-0 rounded-full student-cat-shimmer" />
            <div className="h-6 w-12 shrink-0 rounded-full student-cat-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await getCategories();
      setItems(categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return items;

    const search = q.toLowerCase();

    return items.filter(
      (category) =>
        category.name.toLowerCase().includes(search) ||
        (category.description ?? "").toLowerCase().includes(search)
    );
  }, [items, q]);

  const cols: DataTableColumn<Category>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="font-medium">{c.name}</span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (c) => (
        <span className="text-muted-foreground">{c.description}</span>
      ),
    },
    {
      key: "bookCount",
      header: "Books",
      sortable: true,
      render: (c) => <Badge variant="secondary">{c.bookCount}</Badge>,
    },
    {
      key: "thesisCount",
      header: "FYDP",
      sortable: true,
      render: (c) => <Badge variant="secondary">{c.thesisCount}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Browse books and FYDP by topic."
      />

      <div className="mb-4">
        <Input
          placeholder="Search categories..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <StudentCategoriesSkeleton />
      ) : (
        <DataTable
          data={filtered}
          columns={cols}
          onRowClick={(category) =>
            navigate(`/student/categories/${category.id}`)
          }
        />
      )}
    </div>
  );
}