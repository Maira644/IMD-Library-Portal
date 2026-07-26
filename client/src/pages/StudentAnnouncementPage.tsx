import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { getAnnouncements } from "@/api/announcement";
import type { Announcement } from "@/types";
import { toast } from "sonner";

export function StudentAnnouncementPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAnnouncements();
        setItems(data);
      } catch {
        toast.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = [...items].sort((a, b) => {
    if (a.pinned === b.pinned) {
      // Both pinned or both not pinned - sort by createdAt descending (newest first)
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    } else if (a.pinned && !b.pinned) {
      // a is pinned, b is not - a should come first
      return -1;
    } else {
      // a is not pinned, b is pinned - a should come after
      return 1;
    }
  });

  return (
    <div>
      <PageHeader title="Announcements" description="Latest updates from the library." />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading announcements...</p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((a) => (
            <div key={a.id} className="relative">
              <AnnouncementCard a={a} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}