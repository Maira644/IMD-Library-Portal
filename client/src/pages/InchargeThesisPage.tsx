import { useMemo, useState, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThesisForm } from "@/components/thesis/ThesisForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { mockCategories } from "@/data/mockCategories";
import type { Thesis } from "@/types";
import { toast } from "sonner";
import { useSearchTracker } from "@/contexts/SearchContext";
import {
  getAllThesis,
  deleteThesis,
} from "@/api/thesis";

export function InchargeThesisPage() {
  const [items, setItems] = useState<Thesis[]>([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Thesis | undefined>();
  const [delId, setDelId] = useState<string | null>(null);

  const { track } = useSearchTracker();

  // Load thesis from backend
  const fetchThesis = async () => {
    try {
      const response = await getAllThesis();
      setItems(response.thesis);
    } catch (error) {
      console.error("Failed to fetch thesis:", error);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  const filtered = useMemo(() => {
    let list = items;

    if (dept !== "all") {
      list = list.filter((t) => t.department === dept);
    }

    if (q.trim()) {
      const n = q.toLowerCase();

      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(n) ||
          t.studentNames.some((s) => s.toLowerCase().includes(n))
      );
    }

    return list;
  }, [items, q, dept]);

  const columns: DataTableColumn<Thesis>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      className: "w-28",
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (t) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{t.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.studentNames.join(", ")}
          </p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
    },
    {
      key: "supervisor",
      header: "Supervisor",
    },
    {
      key: "submissionYear",
      header: "Year",
      sortable: true,
      render: (t) => t.submissionYear,
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (t) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditing(t);
                setOpenForm(true);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDelId(t.id)}
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
        title="Thesis"
        description="Manage the thesis archive."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setOpenForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Thesis
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          placeholder="Search title, student..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);

            if (e.target.value) {
              track(e.target.value);
            }
          }}
        />

        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>

            {mockCategories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["title", "department"]}
      />

      <ThesisForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        onSubmit={async () => {
          await fetchThesis();

          toast.success(
            editing
              ? "Thesis updated successfully"
              : "Thesis created successfully"
          );

          setEditing(undefined);
        }}
      />

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={async () => {
          if (!delId) return;

          try {
            await deleteThesis(delId);

            await fetchThesis();

            toast.success("Thesis deleted successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete thesis");
          }

          setDelId(null);
        }}
      />
    </div>
  );
}