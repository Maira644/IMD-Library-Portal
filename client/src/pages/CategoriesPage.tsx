import { useState } from "react";
import { Plus, MoreHorizontal, Tag } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { mockCategories } from "@/data/mockCategories";
import type { Category } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function CategoriesPage() {
  const [items, setItems] = useState<Category[]>(mockCategories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState<Category>({ id: "", name: "", description: "", count: 0, createdAt: new Date().toISOString() });

  const cols: DataTableColumn<Category>[] = [
    { key: "name", header: "Name", sortable: true, render: (c) => (
      <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> <span className="font-medium">{c.name}</span></div>
    )},
    { key: "description", header: "Description", render: (c) => <span className="text-muted-foreground">{c.description}</span> },
    { key: "count", header: "Items", sortable: true, render: (c) => <Badge variant="secondary">{c.count}</Badge> },
    { key: "actions", header: "", className: "w-12 text-right", render: (c) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { setEditing(c); setForm(c); setOpen(true); }}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => setDelId(c.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize books and thesis by topic."
        actions={
          <Button onClick={() => { setEditing(undefined); setForm({ id: `c-${Date.now()}`, name: "", description: "", count: 0, createdAt: new Date().toISOString() }); setOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New category
          </Button>
        }
      />
      <DataTable data={items} columns={cols} searchKeys={["name", "description"]} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setItems((prev) => {
              const exists = prev.some((x) => x.id === form.id);
              toast.success(exists ? "Category updated" : "Category created");
              return exists ? prev.map((x) => x.id === form.id ? form : x) : [form, ...prev];
            });
            setOpen(false);
          }} className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((c) => c.id !== delId));
          toast.success("Category deleted");
          setDelId(null);
        }}
      />
    </div>
  );
}
