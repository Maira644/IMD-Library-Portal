import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, FileText, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";

interface DetailProps {
  cover?: string;
  title: string;
  subtitle: React.ReactNode;
  meta: { label: string; value: string | number }[];
  description: string;
  keywords: string[];
  pdfUrl?: string;
  related?: React.ReactNode;
}

export function ResourceDetail({ cover, title, subtitle, meta, description, keywords, pdfUrl, related }: DetailProps) {
  const navigate = useNavigate();
  const [pdfError, setPdfError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] bg-muted">
              {cover ? (
                <img
                  src={cover}
                  alt={title}
                  onClick={() => setPreviewOpen(true)}
                  className="h-full w-full object-cover cursor-pointer transition hover:scale-[1.02]"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <FileText className="h-10 w-10" />
                </div>
              )}
            </div>
          </Card>
          <div className="mt-3 space-y-2">
            {pdfUrl ? (
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <a href={pdfUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Open PDF in New Tab
                  </a>
                </Button>
              </div>
            ) : (
              <Button className="w-full" variant="outline" disabled>
                Digital copy not available
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <Badge key={k} variant="secondary">
                {k}
              </Badge>
            ))}
          </div>
          <Card className="mt-6">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label}>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
                  <p className="mt-0.5 text-sm font-medium">{m.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Abstraction</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {pdfUrl && (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold">Preview</h2>
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
                {!pdfError ? (
                  <iframe
                    src={pdfUrl}
                    title="Thesis PDF preview"
                    className="w-full h-full border-0"
                    loading="lazy"
                    onError={() => setPdfError(true)}
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-muted-foreground p-4 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-medium text-red-600">Failed to load PDF preview</p>
                    <p className="text-xs mt-1">The PDF could not be embedded. Please use "Open PDF in New Tab" button above.</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setPdfError(false)}>
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          {!pdfUrl && (
            <div className="mt-6">
              <EmptyState title="No preview available" description="A digital copy has not been uploaded yet." icon={FileText} />
            </div>
          )}

          {related && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Related resources</h2>
              {related}
            </div>
          )}
        </motion.div>
      </div>

      {previewOpen && cover && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md hover:bg-gray-100"
            >
              ✕
            </button>

            <img
              src={cover}
              alt={title}
              className="max-h-[90vh] max-w-[80vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}