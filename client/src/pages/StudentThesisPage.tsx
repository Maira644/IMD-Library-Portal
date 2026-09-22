import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";


import { getAllThesis } from "@/api/thesis";

import type { Thesis } from "@/types";
import { useSearchTracker } from "@/contexts/SearchContext";

// Skeleton loader shown while thesis records are being fetched
function StudentThesisSkeleton() {
  return (
    <div className="rounded-md border overflow-hidden">
      <style>{`
        @keyframes student-thesis-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .student-thesis-shimmer {
          background: linear-gradient(
            90deg,
            hsl(var(--muted)) 25%,
            hsl(var(--muted-foreground) / 0.25) 50%,
            hsl(var(--muted)) 75%
          );
          background-size: 200% 100%;
          animation: student-thesis-shimmer 1.4s ease-in-out infinite;
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
            <div className="h-4 w-14 shrink-0 rounded student-thesis-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded student-thesis-shimmer" />
              <div className="h-3 w-1/3 rounded student-thesis-shimmer" />
            </div>
            <div className="h-4 w-28 shrink-0 rounded student-thesis-shimmer" />
            <div className="h-4 w-28 shrink-0 rounded student-thesis-shimmer" />
            <div className="h-4 w-16 shrink-0 rounded student-thesis-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentThesisPage() {
  const [items, setItems] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  

  const { track } = useSearchTracker();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchThesis() {
      try {
        setLoading(true);
        const data = await getAllThesis();
        setItems(data.thesis);
      } catch (error) {
        console.error("Failed to fetch FYDP:", error);
      } finally {
        setLoading(false);
      }
    }

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
      className: "w-28",
    },
    {
    key: "title",
    header: "Title",
    sortable: true,
    className: "w-[45%]",
    render: (t) => (
      <div className="min-w-0">
        <p className="font-medium break-words whitespace-normal">
          {t.title}
        </p>

        <p className="text-xs text-muted-foreground break-words whitespace-normal">
          {t.studentRollNos?.join(", ") || "No students"}
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
      header: "Submission Year",
      sortable: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="FYDP"
        description="Browse the department FYDP archive."
        actions={null}
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
        <StudentThesisSkeleton />
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["title", "department"]}
          onRowClick={(row) => navigate(`/student/thesis/${row.id}`)}
        />
      )}
    </div>
  );
}