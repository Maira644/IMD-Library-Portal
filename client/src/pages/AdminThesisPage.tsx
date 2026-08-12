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

import { ThesisForm } from "@/components/thesis/ThesisForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import type { Thesis } from "@/types";
import { toast } from "sonner";
import { useSearchTracker } from "@/contexts/SearchContext";
import {
  getAllThesis,
  deleteThesis,
} from "@/api/thesis";

import { useNavigate } from "react-router-dom"; // ADD

export function AdminThesisPage() {
  const navigate = useNavigate(); // ADD
  const [items, setItems] = useState<Thesis[]>([]);
  // ...rest stays the same
  const [q, setQ] = useState("");

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
      console.error("Failed to fetch FYDP:", error);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  const filtered = useMemo(() => {
    let list = items;



    if (q.trim()) {
      const n = q.toLowerCase();

      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(n) ||
          Array.isArray(t.studentRollNos) &&
          t.studentRollNos.some((r) => r.toLowerCase().includes(n))
      );
    }

    return list;
  }, [items, q]);

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
          <p className="font-medium whitespace-normal break-words">
            {t.title}
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
      key: "views",
      header: "Views",
      sortable: true,
      className: "text-center",
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (t) => (
        <div onClick={(e) => e.stopPropagation()}>
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
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="FYDP"
        description="Manage the FYDP archive."
        actions={
          <Button
            onClick={() => {
              setEditing(undefined);
              setOpenForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add FYDP
          </Button>
        }
      />

      <div className="mb-4">
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
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        // searchKeys={["title", "department"]}
        onRowClick={(t) => navigate(`/admin/thesis/${t.id}`)}
      />

      <ThesisForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        uploadedBy="Admin"
        onSubmit={async () => {
          await fetchThesis();

          toast.success(
            editing
              ? "FYDP updated successfully"
              : "FYDP created successfully"
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

            toast.success("FYDP deleted successfully");
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete FYDP");
          }

          setDelId(null);
        }}
      />
    </div>
  );
}