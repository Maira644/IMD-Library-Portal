import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { ThesisCard } from "@/components/thesis/ThesisCard";

import {
  getAllThesis,
  getThesisById,
  incrementThesisView,
} from "@/api/thesis";
import type { Thesis } from "@/types";

export function StudentThesisDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [t, setThesis] = useState<Thesis | null>(null);
  const [related, setRelated] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const viewCounted = useRef(false);

  useEffect(() => {
  if (!id) return;

  const thesisId = id;

  if (viewCounted.current) return;

  viewCounted.current = true;

  async function fetchData() {
    try {
      setLoading(true);

      await incrementThesisView(thesisId);

      const thesis = await getThesisById(thesisId);
      setThesis(thesis);

      const all = await getAllThesis();

      const relatedThesis = all.thesis
        .filter(
          (x: Thesis) =>
            x.department === thesis.department &&
            x.id !== thesis.id
        )
        .slice(0, 5);

      setRelated(relatedThesis);
    } catch (error) {
      console.error("Failed to fetch FYDP:", error);
      setThesis(null);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [id]);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  if (!t) {
    return (
      <p className="text-center text-muted-foreground">
        FYDP not found.
      </p>
    );
  }

  // Cloudinary display transformation (original image remains unchanged)
  const displayCover = t.coverUrl?.replace(
    "/upload/",
    "/upload/c_pad,w_400,h_600,b_white/"
  );

  return (
    <ResourceDetail
      cover={displayCover}
      title={t.title}
      subtitle={
        <div className="space-y-1">
          <p>Supervised by {t.supervisor}</p>

          {t.studentRollNos?.length > 0 && (
            <p>
              Roll Nos: {t.studentRollNos.join(", ")}
            </p>
          )}
        </div>
      }
      meta={[
        { label: "FYDP ID", value: t.id },
        { label: "Department", value: t.department },
        
        { label: "Submission year", value: t.submissionYear },
        { label: "Industry", value: t.industry },
        { label: "Category", value: t.category },
        { label: "Cabinet No.", value: t.cabinetNo },
        { label: "Shelf No.", value: t.shelfNo },
        { label: "Uploaded by", value: t.uploadedBy },
        {
          label: "Upload date",
          value: new Date(t.uploadDate).toLocaleDateString(),
        },
      ]}
      description={t.abstract}
      keywords={t.keywords}
      pdfUrl={t.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((x) => (
            <ThesisCard
              key={x.id}
              thesis={x}
              hrefBase="/student/thesis"
            />
          ))}
        </div>
      }
    />
  );
}