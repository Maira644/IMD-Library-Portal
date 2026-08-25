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

export function StudentCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      setItems(categories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories.");
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

      <DataTable
        data={filtered}
        columns={cols}
        onRowClick={(category) =>
          navigate(`/student/categories/${category.id}`)
        }
      />
    </div>
  );
}