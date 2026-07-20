import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { mockIncharges } from "@/data/mockIncharges";
import type { User } from "@/types";
import { toast } from "sonner";

export function InchargesPage() {
  const [items, setItems] = useState<User[]>(mockIncharges);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | undefined>();
  const [delId, setDelId] = useState<string | null>(null);
  const [form, setForm] = useState<User>({ id: "", username: "", name: "", email: "", role: "incharge", department: "", createdAt: new Date().toISOString(), active: true });

  const cols: DataTableColumn<User>[] = [
    { key: "name", header: "Name", sortable: true, render: (u) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{u.name.split(" ").map(s => s[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
        <div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">@{u.username}</p></div>
      </div>
    )},
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "active", header: "Status", render: (u) => (
      u.active ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>
    )},
    { key: "createdAt", header: "Since", render: (u) => new Date(u.createdAt).toLocaleDateString() },
    { key: "actions", header: "", className: "w-12 text-right", render: (u) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { setEditing(u); setForm(u); setOpen(true); }}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setItems((prev) => prev.map((x) => x.id === u.id ? { ...x, active: !x.active } : x));
            toast.success(`${u.active ? "Deactivated" : "Activated"} ${u.name}`);
          }}>{u.active ? "Deactivate" : "Activate"}</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => setDelId(u.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Library incharges"
        description="Provision and manage staff accounts."
        actions={
          <Button onClick={() => {
            setEditing(undefined);
            setForm({ id: `in-${Date.now()}`, username: "", name: "", email: "", role: "incharge", department: "", createdAt: new Date().toISOString(), active: true });
            setOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Add incharge
          </Button>
        }
      />
      <DataTable data={items} columns={cols} searchKeys={["name", "email", "department", "username"]} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit incharge" : "New incharge"}</DialogTitle></DialogHeader>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim() || !form.email.trim()) return;
            setItems((prev) => {
              const exists = prev.some((x) => x.id === form.id);
              toast.success(exists ? "Incharge updated" : "Incharge created");
              return exists ? prev.map((x) => x.id === form.id ? form : x) : [form, ...prev];
            });
            setOpen(false);
          }}>
            <div><Label>Full name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Label>Username *</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
            <div className="sm:col-span-2"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="sm:col-span-2"><Label>Department</Label><Input value={form.department ?? ""} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((x) => x.id !== delId));
          toast.success("Incharge removed");
          setDelId(null);
        }}
      />
    </div>
  );
}
