// import { useParams } from "react-router-dom";
// import { mockThesis } from "@/data/mockThesis";
// import { ResourceDetail } from "@/components/shared/ResourceDetail";
// import { ThesisCard } from "@/components/thesis/ThesisCard";

// export function InchargeThesisDetailPage() {
//     const { id } = useParams<{ id: string }>();
//     const t = mockThesis.find((x) => x.id === id);
//     if (!t) return <p className="text-center text-muted-foreground">Thesis not found.</p>;
//     const related = mockThesis.filter((x) => x.department === t.department && x.id !== t.id).slice(0, 5);
//     return (
//         <ResourceDetail
//             cover={t.coverUrl}
//             title={t.title}
//             subtitle={`by ${t.studentNames.join(", ")} · Supervised by ${t.supervisor}`}
//             meta={[
//                 { label: "Thesis ID", value: t.id },
//                 { label: "Department", value: t.department },
//                 { label: "Submission year", value: t.submissionYear },
//                 { label: "Category", value: t.category },
//                 { label: "Uploaded by", value: t.uploadedBy },
//                 { label: "Upload date", value: new Date(t.uploadDate).toLocaleDateString() },
//             ]}
//             description={t.abstract}
//             keywords={t.keywords}
//             pdfUrl={t.pdfUrl}
//             related={
//                 <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//                     {related.map((x) => (
//                         <ThesisCard
//                             key={x.id}
//                             thesis={x}
//                             hrefBase="/library/thesis"
//                         />
//                     ))}
//                 </div>
//             }
//         />
//     );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResourceDetail } from "@/components/shared/ResourceDetail";
import { ThesisCard } from "@/components/thesis/ThesisCard";
import { getAllThesis, getThesisById } from "@/api/thesis";
import type { Thesis } from "@/types";

export function InchargeThesisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [thesis, setThesis] = useState<Thesis | null>(null);
  const [related, setRelated] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        const t = await getThesisById(id!);
        setThesis(t);

        // fetch all to compute related-by-department
        const all = await getAllThesis();
        const relatedList = all.thesis
          .filter((x: Thesis) => x.department === t.department && x.id !== t.id)
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
    return <p className="text-center text-muted-foreground">Loading…</p>;
  }

  if (!thesis) {
    return <p className="text-center text-muted-foreground">Thesis not found.</p>;
  }

  return (
    <ResourceDetail
      cover={thesis.coverUrl}
      title={thesis.title}
      subtitle={`by ${thesis.studentNames.join(", ")} · Supervised by ${thesis.supervisor}`}
      meta={[
        { label: "Thesis ID", value: thesis.id },
        { label: "Department", value: thesis.department },
        { label: "Submission year", value: thesis.submissionYear },
        { label: "Category", value: thesis.category },
        { label: "Uploaded by", value: thesis.uploadedBy },
        { label: "Upload date", value: new Date(thesis.uploadDate).toLocaleDateString() },
      ]}
      description={thesis.abstract}
      keywords={thesis.keywords}
      pdfUrl={thesis.pdfUrl}
      related={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {related.map((x) => (
            <ThesisCard key={x.id} thesis={x} hrefBase="/library/thesis" />
          ))}
        </div>
      }
    />
  );
}