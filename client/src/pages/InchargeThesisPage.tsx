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

// Skeleton loader shown while thesis records are being fetched
function ThesisSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <style>{`
        @keyframes incharge-thesis-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .incharge-thesis-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted-foreground) / 0.25) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: incharge-thesis-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="flex items-center justify-center gap-2 py-6 border-b bg-muted/30">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading FYDP records...
        </span>
      </div>

      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-12 shrink-0 rounded incharge-thesis-shimmer" />
            <div className="h-4 flex-1 rounded incharge-thesis-shimmer" />
            <div className="h-4 w-28 shrink-0 rounded incharge-thesis-shimmer" />
            <div className="h-4 w-28 shrink-0 rounded incharge-thesis-shimmer" />
            <div className="h-4 w-12 shrink-0 rounded incharge-thesis-shimmer" />
            <div className="h-8 w-8 shrink-0 rounded incharge-thesis-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InchargeThesisPage() {
  const navigate = useNavigate(); // ADD
  const [items, setItems] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  // ...rest stays the same
  const [q, setQ] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Thesis | undefined>();
  const [delId, setDelId] = useState<string | null>(null);

  const { track } = useSearchTracker();

  // Load thesis from backend
  const fetchThesis = async () => {
    try {
      setLoading(true);
      const response = await getAllThesis();
      setItems(response.thesis);
    } catch (error) {
      console.error("Failed to fetch thesis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThesis();
  }, []);

  const filtered = useMemo(() => {
    let list = [...items];
  
    if (q.trim()) {
      const n = q.toLowerCase();
  
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(n) ||
          (Array.isArray(t.studentRollNos) &&
            t.studentRollNos.some((r) =>
              r.toLowerCase().includes(n)
            ))
      );
    }
  
    return list.sort((a, b) => {
      // First: earliest year → latest year
      const yearA = Number(a.submissionYear);
      const yearB = Number(b.submissionYear);
  
      if (yearA !== yearB) {
        return yearB - yearA;
      }
  
      // Second: FY ID in numerical ascending order
      const getIdNumber = (id: string) => {
        const match = id.match(/\d+/);
        return match ? Number(match[0]) : 0;
      };
  
      return getIdNumber(a.id) - getIdNumber(b.id);
    });
  }, [items, q]);

  const columns: DataTableColumn<Thesis>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      className: "w-24",
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      className: "min-w-[450px]",
      render: (t) => (
        <div className="min-w-0">
          <p className="font-medium break-words line-clamp-2 leading-6">
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

      {loading ? (
        <ThesisSkeleton />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          // searchKeys={["title", "department"]}
          onRowClick={(t) => navigate(`/library/thesis/${t.id}`)}
        />
      )}

      <ThesisForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        uploadedBy="Incharge"
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