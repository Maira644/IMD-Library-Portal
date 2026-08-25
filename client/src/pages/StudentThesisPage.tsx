import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";


import { getAllThesis } from "@/api/thesis";

import type { Thesis } from "@/types";
import { useSearchTracker } from "@/contexts/SearchContext";

export function StudentThesisPage() {
  const [items, setItems] = useState<Thesis[]>([]);
  const [q, setQ] = useState("");
  

  const { track } = useSearchTracker();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchThesis() {
      try {
        const data = await getAllThesis();
        setItems(data.thesis);
      } catch (error) {
        console.error("Failed to fetch FYDP:", error);
      }
    }

    fetchThesis();
  }, []);

  const filtered = useMemo(() => {
    let list = items;

    if (q.trim()) {
      const n = q.toLowerCase();

      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(n) ||
          t.studentRollNos.some((s) => s.toLowerCase().includes(n))
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
          <p className="truncate font-medium">{t.title}</p>
          <p className="truncate text-xs text-muted-foreground">
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

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["title", "department"]}
        onRowClick={(row) => navigate(`/student/thesis/${row.id}`)}
      />
    </div>
  );
}