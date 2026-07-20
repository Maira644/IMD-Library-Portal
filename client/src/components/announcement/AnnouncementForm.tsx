import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Announcement } from "@/types";

export function AnnouncementForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  authorName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Announcement;
  onSubmit: (a: Announcement) => void;
  authorName: string;
}) {
  const [form, setForm] = useState<Announcement>(
    initial ?? {
      id: `a-${Date.now()}`,
      title: "",
      body: "",
      imageUrl: "",
      pinned: false,
      expiresAt: "",
      createdBy: authorName,
      createdAt: new Date().toISOString(),
    },
  );

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit announcement" : "New announcement"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.title.trim() || !form.body.trim()) return;
            onSubmit(form);
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Body *</Label>
            <Textarea rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          </div>
          {/* <div>
            <Label>Image URL (optional)</Label>
            <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div> */}
          <div>
            <Label>Expires at (optional)</Label>
            <Input
              type="date"
              value={form.expiresAt ? form.expiresAt.substring(0, 10) : ""}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Pin announcement</p>
              <p className="text-xs text-muted-foreground">Keep it at the top of the list</p>
            </div>
            <Switch checked={form.pinned} onCheckedChange={(v) => setForm({ ...form, pinned: v })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initial ? "Save" : "Publish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
