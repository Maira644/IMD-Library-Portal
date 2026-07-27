import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { ThesisCard } from "@/components/thesis/ThesisCard";
import { getAllThesis, getThesisById } from "@/api/thesis";
import type { Thesis } from "@/types";

export function AdminThesisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [related, setRelated] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);

        if (!id) return;

        const t = await getThesisById(id);
        setThesis(t);

        // Fetch all thesis to show related ones
        const all = await getAllThesis();

        const relatedList = all.thesis
          .filter(
            (x: Thesis) =>
              x.department === t.department &&
              x.id !== t.id
          )
          .slice(0, 5);

        setRelated(relatedList);
      } catch (error) {
        console.error("Failed to fetch thesis:", error);
        setThesis(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  if (!thesis) {
    return (
      <p className="text-center text-muted-foreground">
        Thesis not found.
      </p>
    );
  }

  // Cloudinary display transformation (does NOT modify the original image)
  const displayCover = thesis.coverUrl?.replace(
    "/upload/",
    "/upload/c_pad,w_400,h_600,b_white/"
  );

  return (
    <ResourceDetail
      cover={displayCover}
      title={thesis.title}
      subtitle={`by ${thesis.studentNames.join(", ")} · Supervised by ${thesis.supervisor}`}
      meta={[
        { label: "Thesis ID", value: thesis.id },
        { label: "Department", value: thesis.department },
        { label: "Submission year", value: thesis.submissionYear },
        { label: "Category", value: thesis.category },
        { label: "Cabinet No.", value: thesis.cabinetNo },
        { label: "Shelf No.", value: thesis.shelfNo },
        { label: "Uploaded by", value: thesis.uploadedBy },
        {
          label: "Upload date",
          value: new Date(thesis.uploadDate).toLocaleDateString(),
        },
      ]}
      description={thesis.abstract}
      keywords={thesis.keywords}
      pdfUrl={thesis.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((x) => (
            <ThesisCard
              key={x.id}
              thesis={x}
              hrefBase="/admin/thesis"
            />
          ))}
        </div>
      }
    />
  );
}