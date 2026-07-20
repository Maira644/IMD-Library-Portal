import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCategories } from "@/data/mockCategories";
import type { Thesis } from "@/types";

export function ThesisForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Thesis;
  onSubmit: (data: Thesis) => void;
}) {
  const [form, setForm] = useState<Thesis>(
    initial ?? {
      id: `TH-${Date.now()}`,
      title: "",
      studentNames: [""],
      supervisor: "",
      department: mockCategories[0].name,
      submissionYear: new Date().getFullYear(),
      category: mockCategories[0].name,
      abstract: "",
      keywords: [],
      coverUrl: "",
      pdfUrl: "",
      uploadedBy: "You",
      uploadDate: new Date().toISOString(),
      views: 0,
    },
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [keywordsText, setKeywordsText] = useState(form.keywords.join(", "));

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setKeywordsText(initial.keywords.join(", "));
    }
  }, [initial]);

  function set<K extends keyof Thesis>(k: K, v: Thesis[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit thesis" : "Add new thesis"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const kws = keywordsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
            if (!form.title.trim() || !form.studentNames[0]?.trim()) return;
            onSubmit({ ...form, keywords: kws });
            onOpenChange(false);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
         <div className="sm:col-span-2">
            <Label>Student names (up to 4) *</Label>
            <div className="grid gap-2">
              {form.studentNames.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={name}
                    placeholder={`Student ${i + 1}`}
                    required={i === 0}
                    onChange={(e) => {
                      const next = [...form.studentNames];
                      next[i] = e.target.value;
                      set("studentNames", next);
                    }}
                  />
                  {form.studentNames.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => set("studentNames", form.studentNames.filter((_, idx) => idx !== i))}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              {form.studentNames.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("studentNames", [...form.studentNames, ""])}
                >
                  + Add student
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label>Supervisor</Label>
            <Input value={form.supervisor} onChange={(e) => set("supervisor", e.target.value)} />
          </div>
          <div>
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => set("department", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {mockCategories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Submission year</Label>
            <Input type="number" value={form.submissionYear} onChange={(e) => set("submissionYear", Number(e.target.value))} />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {mockCategories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Abstract</Label>
            <Textarea rows={4} value={form.abstract} onChange={(e) => set("abstract", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Keywords (up to 5)</Label>
            <Input value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} />
          </div>
         <div>
            <Label>Cover image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setCoverFile(file);
                if (file) set("coverUrl", URL.createObjectURL(file));
              }}
            />
            {form.coverUrl && (
              <img src={form.coverUrl} alt="Cover preview" className="mt-2 h-24 w-auto rounded border object-cover" />
            )}
          </div>
          <div>
            <Label>PDF file (optional)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setPdfFile(file);
                if (file) set("pdfUrl", URL.createObjectURL(file));
              }}
            />
            {pdfFile && <p className="mt-1 truncate text-xs text-muted-foreground">{pdfFile.name}</p>}
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save changes" : "Create thesis"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
