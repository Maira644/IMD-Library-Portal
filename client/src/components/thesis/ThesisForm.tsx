import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories } from "@/api/category";
import type { Category } from "@/types";
import type { Thesis } from "@/types";
import { createThesis, updateThesis } from "@/api/thesis";

export function ThesisForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  uploadedBy,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Thesis;
  onSubmit: () => Promise<void>;
  uploadedBy: "Admin" | "Incharge";
}) {
  const [form, setForm] = useState<Thesis>(
    initial ?? {
      id: "",
      title: "",
      studentNames: [""],
      supervisor: "",
      department: "Industrial And Manufacturing",
      industry: "",
      submissionYear: new Date().getFullYear(),
      category: "",
      abstract: "",
      cabinetNo: "",
      shelfNo: "",
      keywords: [],
      coverUrl: "",
      pdfUrl: "",
      uploadedBy,
      uploadDate: new Date().toISOString(),
      views: 0,
    },
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [keywordsText, setKeywordsText] = useState(form.keywords.join(", "));
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (initial) {
      setForm(initial);
      setKeywordsText(initial.keywords.join(", "));
    }
  }, [initial]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);

        // Set the first category automatically
        if (!initial && data.length > 0) {
          setForm((prev) => ({
            ...prev,
            category: data[0].name,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  function set<K extends keyof Thesis>(k: K, v: Thesis[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit FYDP" : "Add new FYDP"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            if (!e.currentTarget.checkValidity()) {
              return;
            }

            e.preventDefault();

            const kws = keywordsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 5);

            try {
              const formData = new FormData();

              formData.append("id", form.id);
              formData.append("title", form.title);
              formData.append(
                "studentNames",
                form.studentNames
                  .filter((s) => s.trim())
                  .join(",")
              );
              formData.append("supervisor", form.supervisor);
              formData.append("department", form.department);
              formData.append("industry", form.industry);
              formData.append(
                "submissionYear",
                String(form.submissionYear)
              );
              formData.append("category", form.category);
              formData.append("cabinetNo", form.cabinetNo);
              formData.append("shelfNo", form.shelfNo);
              formData.append("abstract", form.abstract);
              formData.append(
                "keywords",
                kws.join(",")
              );
              formData.append("uploadedBy", form.uploadedBy);
              formData.append("uploadDate", form.uploadDate);

              if (coverFile) {
                formData.append("cover", coverFile);
              }

              if (pdfFile) {
                formData.append("pdf", pdfFile);
              }

              if (initial) {
                await updateThesis(form.id, formData);
              } else {
                await createThesis(formData);
              }

              // Reset the form
              setForm({
                id: "",
                title: "",
                studentNames: [""],
                supervisor: "",
                department: "Industrial And Manufacturing",
                industry: "",
                submissionYear: new Date().getFullYear(),
                category: "",
                abstract: "",
                cabinetNo: "",
                shelfNo: "",
                keywords: [],
                coverUrl: "",
                pdfUrl: "",
                uploadedBy,
                uploadDate: new Date().toISOString(),
                views: 0,
              });

              setKeywordsText("");
              setCoverFile(null);
              setPdfFile(null);

              await onSubmit();

              onOpenChange(false);
            } catch (err: any) {
              console.error(err);

              if (err.response) {
                console.log("Backend Error:", err.response.data);
                alert(JSON.stringify(err.response.data));
              } else {
                alert(err.message);
              }
            }
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div>
            <Label>FYDP ID *</Label>
            <Input
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              placeholder=""
              required
              // disabled={!!initial}
            />
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Label>Student names (up to 4) </Label>
            <div className="grid gap-2">
              {form.studentNames.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={name}
                    placeholder={`Student ${i + 1}`}
                    // required={i === 0}
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
            <Input
              value={form.supervisor}
              onChange={(e) => set("supervisor", e.target.value)}
              required
            />
          </div>
          {/* Department */}
          <div>
            <Label>Department *</Label>
            <Input
              value="Industrial And Manufacturing"
              readOnly
            />
          </div>
          <div>
            <Label>Industry</Label>
            <Input
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="e.g. IMC, GSK, Pharmaceutical"
            />
          </div>
          <div>
            <Label>Submission year</Label>
            <Input
              type="number"
              value={form.submissionYear}
              onChange={(e) => set("submissionYear", Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cabinet No </Label>
            <Input
              value={form.cabinetNo}
              onChange={(e) => set("cabinetNo", e.target.value)}
              placeholder="e.g. Cabinet 1"

            />
          </div>

          <div>
            <Label>Shelf No </Label>
            <Input
              value={form.shelfNo}
              onChange={(e) => set("shelfNo", e.target.value)}
              placeholder="e.g. Shelf A"

            />
          </div>

          <div className="sm:col-span-2">
            <Label>Abstract</Label>
            <Textarea
              rows={4}
              value={form.abstract}
              onChange={(e) => set("abstract", e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Keywords (up to 5)</Label>
            <Input
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Cover image (optional)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setCoverFile(file);
                if (file) set("coverUrl", URL.createObjectURL(file));
              }}
            />
            {form.coverUrl ? (
              <img
                src={form.coverUrl}
                alt="Cover preview"
                className="mt-2 h-24 w-auto rounded border object-cover"
              />
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                No cover image selected
              </p>
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
            <Button type="submit">{initial ? "Save changes" : "Create FYDP"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}