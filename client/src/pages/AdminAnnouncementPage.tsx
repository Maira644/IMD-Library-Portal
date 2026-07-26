import { useEffect, useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { AnnouncementForm } from "@/components/announcement/AnnouncementForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
} from "@/api/announcement";
import { useAuth } from "@/contexts/AuthContext";
import type { Announcement } from "@/types";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AdminAnnouncementPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | undefined>();
  const [delId, setDelId] = useState<string | null>(null);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setItems(data);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const sorted = [...items].sort((a, b) =>
    a.pinned === b.pinned ? +new Date(b.createdAt) - +new Date(a.createdAt) : a.pinned ? -1 : 1
  );

  async function handleSubmit(a: Announcement) {
    const payload = {
      title: a.title,
      body: a.body,
      imageUrl: a.imageUrl,
      pinned: a.pinned,
      expiresAt: a.expiresAt,
    };

    try {
      if (editing) {
        const res = await updateAnnouncement(editing.id, payload);
        setItems((prev) => prev.map((x) => (x.id === editing.id ? res.announcement : x)));
        toast.success("Announcement updated");
      } else {
        const res = await createAnnouncement(payload);
        setItems((prev) => [res.announcement, ...prev]);
        toast.success("Announcement published");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handlePinToggle(a: Announcement) {
    try {
      const res = await togglePinAnnouncement(a.id);
      setItems((prev) => prev.map((x) => (x.id === a.id ? res.announcement : x)));
    } catch {
      toast.error("Failed to update pin status");
    }
  }

  async function handleDelete() {
    if (!delId) return;
    try {
      await deleteAnnouncement(delId);
      setItems((prev) => prev.filter((x) => x.id !== delId));
      toast.success("Announcement deleted");
    } catch {
      toast.error("Failed to delete announcement");
    } finally {
      setDelId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Publish updates for students and staff."
        actions={
          <Button onClick={() => { setEditing(undefined); setOpenForm(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New announcement
          </Button>
        }
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading announcements...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((a) => (
            <div key={a.id} className="relative">
              <AnnouncementCard a={a} />
              <div className="absolute right-3 top-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditing(a); setOpenForm(true); }}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePinToggle(a)}>{a.pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDelId(a.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        authorName={user?.name ?? "Staff"}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}