import { useParams } from "react-router-dom";
import { mockThesis } from "@/data/mockThesis";
import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { ThesisCard } from "@/components/thesis/ThesisCard";

export function ThesisDetailPage({ hrefBase }: { hrefBase: string }) {
  const { id } = useParams<{ id: string }>();
  const t = mockThesis.find((x) => x.id === id);
  if (!t) return <p className="text-center text-muted-foreground">Thesis not found.</p>;
  const related = mockThesis.filter((x) => x.department === t.department && x.id !== t.id).slice(0, 5);
  return (
    <ResourceDetail
      cover={t.coverUrl}
      title={t.title}
      subtitle={`by ${t.studentNames.join(", ")} · Supervised by ${t.supervisor}`}
      meta={[
        { label: "Thesis ID", value: t.id },
        { label: "Department", value: t.department },
        { label: "Submission year", value: t.submissionYear },
        { label: "Category", value: t.category },
        { label: "Uploaded by", value: t.uploadedBy },
        { label: "Upload date", value: new Date(t.uploadDate).toLocaleDateString() },
      ]}
      description={t.abstract}
      keywords={t.keywords}
      pdfUrl={t.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((x) => <ThesisCard key={x.id} thesis={x} hrefBase={hrefBase} />)}
        </div>
      }
    />
  );
}
