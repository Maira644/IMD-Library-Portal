import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Thesis } from "@/types";

export function ThesisCard({ thesis, hrefBase }: { thesis: Thesis; hrefBase: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
      <Link to={`${hrefBase}/${thesis.id}`} className="block">
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            {thesis.coverUrl ? (
              <img src={thesis.coverUrl} alt={thesis.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <GraduationCap className="h-8 w-8" />
              </div>
            )}
            <Badge className="absolute left-2 top-2 bg-background/90 text-foreground" variant="outline">
              {thesis.department}
            </Badge>
            {thesis.pdfUrl && (
              <Badge className="absolute right-2 top-2 gap-1 bg-primary text-primary-foreground">
                <FileText className="h-3 w-3" /> PDF
              </Badge>
            )}
          </div>
          <CardContent className="p-3">
            <p className="line-clamp-2 text-sm font-semibold">{thesis.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">by {thesis.studentRollNos.join(", ")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{thesis.submissionYear} · {thesis.views} views</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
