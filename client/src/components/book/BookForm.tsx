import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCategories } from "@/data/mockCategories";
import type { Book } from "@/types";

export function BookForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Book;
  onSubmit: (data: Book) => void;
}) {
  const [form, setForm] = useState<Book>(
    initial ?? {
      id: `BK-${Date.now()}`,
      title: "",
      author: "",
      publisher: "",
      edition: "",
      publicationYear: new Date().getFullYear(),
      category: mockCategories[0].name,
      cabinetNo: "",
      shelfNo: "",
      keywords: [],
      coverUrl: "",
      pdfUrl: "",
      physicalCopy: true,
      digitalCopy: false,
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

  function set<K extends keyof Book>(k: K, v: Book[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const kws = keywordsText.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    if (!form.title.trim() || !form.author.trim()) return;
    onSubmit({ ...form, keywords: kws });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit book" : "Add new book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <Field label="Author" required>
            <Input value={form.author} onChange={(e) => set("author", e.target.value)} required />
          </Field>
          <Field label="Publisher">
            <Input value={form.publisher} onChange={(e) => set("publisher", e.target.value)} />
          </Field>
          <Field label="Edition">
            <Input value={form.edition} onChange={(e) => set("edition", e.target.value)} />
          </Field>
          <Field label="Publication year">
            <Input
              type="number"
              value={form.publicationYear}
              onChange={(e) => set("publicationYear", Number(e.target.value))}
            />
          </Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cabinet No.">
            <Input placeholder="e.g. Cabinet 1" value={form.cabinetNo} onChange={(e) => set("cabinetNo", e.target.value)} />
          </Field>
          <Field label="Shelf No.">
            <Input placeholder="e.g. Shelf A" value={form.shelfNo} onChange={(e) => set("shelfNo", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Keywords (up to 5, comma-separated)">
              <Input placeholder="Enter keywords separated by commas" value={keywordsText} onChange={(e) => setKeywordsText(e.target.value)} />
            </Field>
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
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Physical copy</p>
              <p className="text-xs text-muted-foreground">Available in library</p>
            </div>
            <Switch checked={form.physicalCopy} onCheckedChange={(v) => set("physicalCopy", v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Digital copy</p>
              <p className="text-xs text-muted-foreground">PDF available</p>
            </div>
            <Switch checked={form.digitalCopy} onCheckedChange={(v) => set("digitalCopy", v)} />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save changes" : "Create book"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}