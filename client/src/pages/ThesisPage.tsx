import { useMemo, useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
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
import { getCategories } from "@/api/category";
import type { Thesis, Category } from "@/types";
import { toast } from "sonner";
import { useSearchTracker } from "@/contexts/SearchContext";
import { getAllThesis } from "@/api/thesis";

export function ThesisPage({
  hrefBase,
  canManage,
}: {
  hrefBase: string;
  canManage: boolean;
}) {
  const [items, setItems] = useState<Thesis[]>([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Thesis | undefined>();
  const [delId, setDelId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { track } = useSearchTracker();

  useEffect(() => {
    fetchThesis();
    fetchCategories();
  }, []);

  const fetchThesis = async () => {
    try {
      const response = await getAllThesis();
      setItems(response.thesis);
    } catch (error) {
      console.error("Failed to fetch thesis:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

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
          t.studentNames.some((s) => s.toLowerCase().includes(n)),
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
      className: "min-w-[220px]",
      render: (t) => (
        <div className="min-w-0">
          <p className="font-medium truncate">{t.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {t.studentNames.join(", ")}
          </p>
        </div>
      ),
    },

    {
      key: "department",
      header: "Department",
      sortable: true,

      // Fixed width so the department column behaves
      // consistently on every pagination page.
      className: "w-[180px] min-w-[180px] max-w-[180px] whitespace-normal break-words",

      render: (t) => (
        <div className="w-[180px] whitespace-normal break-words leading-5">
          {t.department}
        </div>
      ),
    },

    {
      key: "supervisor",
      header: "Supervisor",
      className: "min-w-[150px]",
      render: (t) => (
        <div className="whitespace-normal break-words">
          {t.supervisor}
        </div>
      ),
    },

    {
      key: "submissionYear",
      header: "Year",
      sortable: true,
      className: "w-20",
      render: (t) => t.submissionYear,
    },

    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (t) =>
        canManage ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
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
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Thesis"
        description={
          canManage
            ? "Manage the thesis archive."
            : "Browse the university thesis archive."
        }
        actions={
          canManage && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setOpenForm(true);
              }}
            >
              Add Thesis
            </Button>
          )
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

            {categories.map((c) => (
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
        uploadedBy={canManage ? "Incharge" : "Admin"}
        onSubmit={async () => {
          await fetchThesis();

          toast.success(
            editing
              ? "Thesis updated successfully"
              : "Thesis created successfully",
          );
        }}
      />

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((x) => x.id !== delId));

          toast.success("Thesis deleted");

          setDelId(null);
        }}
      />
    </>
  );
}