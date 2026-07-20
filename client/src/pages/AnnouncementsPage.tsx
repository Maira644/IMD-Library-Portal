import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { AnnouncementForm } from "@/components/announcement/AnnouncementForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { mockAnnouncements } from "@/data/mockAnnouncements";
import { useAuth } from "@/contexts/AuthContext";
import type { Announcement } from "@/types";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function AnnouncementsPage({ canManage }: { canManage: boolean }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Announcement[]>(mockAnnouncements);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | undefined>();
  const [delId, setDelId] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => (a.pinned === b.pinned ? +new Date(b.createdAt) - +new Date(a.createdAt) : a.pinned ? -1 : 1));

  return (
    <div>
      <PageHeader
        title="Announcements"
        description={canManage ? "Publish updates for students and staff." : "Latest updates from the library."}
        actions={
          canManage && (
            <Button onClick={() => { setEditing(undefined); setOpenForm(true); }}>
              <Plus className="mr-2 h-4 w-4" /> New announcement
            </Button>
          )
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((a) => (
          <div key={a.id} className="relative">
            <AnnouncementCard a={a} />
            {canManage && (
              <div className="absolute right-3 top-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setEditing(a); setOpenForm(true); }}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, pinned: !x.pinned } : x));
                    }}>{a.pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDelId(a.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnnouncementForm
        open={openForm}
        onOpenChange={setOpenForm}
        initial={editing}
        authorName={user?.name ?? "Staff"}
        onSubmit={(a) => {
          setItems((prev) => {
            const exists = prev.some((x) => x.id === a.id);
            toast.success(exists ? "Announcement updated" : "Announcement published");
            return exists ? prev.map((x) => x.id === a.id ? a : x) : [a, ...prev];
          });
        }}
      />
      <ConfirmDialog
        open={!!delId}
        onOpenChange={(v) => !v && setDelId(null)}
        onConfirm={() => {
          setItems((prev) => prev.filter((x) => x.id !== delId));
          toast.success("Announcement deleted");
          setDelId(null);
        }}
      />
    </div>
  );
}
