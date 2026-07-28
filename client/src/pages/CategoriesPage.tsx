import { useEffect, useMemo, useState } from "react";
import { Plus, MoreHorizontal, Tag } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Category } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/category";

export function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [delId, setDelId] = useState<string | null>(null);

  const emptyForm: Category = {
  id: "",
  name: "",
  description: "",
  count: 0,
  bookCount: 0,
  thesisCount: 0,
  createdAt: new Date().toISOString(),
};

  const [form, setForm] = useState<Category>(emptyForm);

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
        <span className="text-muted-foreground">
          {c.description}
        </span>
      ),
    },
   {
  key: "bookCount",
  header: "Books",
  sortable: true,
  render: (c) => (
    <Badge variant="secondary">
      {c.bookCount}
    </Badge>
  ),
},
{
  key: "thesisCount",
  header: "Thesis",
  sortable: true,
  render: (c) => (
    <Badge variant="secondary">
      {c.thesisCount}
    </Badge>
  ),
},
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditing(c);
                setForm(c);
                setOpen(true);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDelId(c.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize books and thesis by topic."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setForm(emptyForm);
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New category
          </Button>
        }
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
      />

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            setEditing(undefined);
            setForm(emptyForm);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "New Category"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!form.name.trim()) {
                toast.error("Category name is required.");
                return;
              }

              try {
                if (editing) {
                  await updateCategory(editing.id, {
                    name: form.name,
                    description: form.description ?? "",
                  });

                  toast.success("Category updated successfully.");
                } else {
                  await createCategory({
                    name: form.name,
                    description: form.description ?? "",
                  });

                  toast.success("Category created successfully.");
                }

                await fetchCategories();

                setEditing(undefined);
                setForm(emptyForm);
                setOpen(false);
              } catch (error: any) {
                console.error(error);

                if (error.response) {
                  toast.error(error.response.data.detail);
                } else {
                  toast.error("Something went wrong.");
                }
              }
            }}
          >
            <div>
              <Label>Name *</Label>

              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Description</Label>

              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setEditing(undefined);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </Button>

              <Button type="submit">
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={async () => {
          if (!delId) return;

          try {
            await deleteCategory(delId);

            toast.success("Category deleted successfully.");

            await fetchCategories();

            setDelId(null);
          } catch (error: any) {
            console.error(error);

            if (error.response) {
              toast.error(error.response.data.detail);
            } else {
              toast.error("Something went wrong.");
            }
          }
        }}
      />
    </div>
  );
}