import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAllThesis } from "@/api/thesis";
import { mockCategories } from "@/data/mockCategories";
import type { Thesis } from "@/types";
import { useSearchTracker } from "@/contexts/SearchContext";

export function StudentThesisPage() {
  const [items, setItems] = useState<Thesis[]>([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");

  const { track } = useSearchTracker();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchThesis() {
      try {
        const data = await getAllThesis();
        setItems(data.thesis);
      } catch (error) {
        console.error("Failed to fetch thesis:", error);
      }
    }

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
      header: "Submission Year",
      sortable: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Thesis"
        description="Browse the university thesis archive."
        actions={null}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          placeholder="Search title, student…"
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
        onRowClick={(row) => navigate(`/student/thesis/${row.id}`)}
      />
    </div>
  );
}