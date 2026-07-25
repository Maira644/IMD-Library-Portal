import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnnouncementCard } from "@/components/announcement/AnnouncementCard";
import { mockAnnouncements } from "@/data/mockAnnouncements";
import type { Announcement } from "@/types";

export function StudentAnnouncementPage() {
  const [items] = useState<Announcement[]>(mockAnnouncements);

  const sorted = [...items].sort((a, b) => (a.pinned === b.pinned ? +new Date(b.createdAt) - +new Date(a.createdAt) : a.pinned ? -1 : 1));

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Latest updates from the library."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((a) => (
          <div key={a.id} className="relative">
            <AnnouncementCard a={a} />
          </div>
        ))}
      </div>
    </div>
  );
}