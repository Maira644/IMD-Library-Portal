import { motion } from "framer-motion";
import { Pin, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/types";

export function AnnouncementCard({ a }: { a: Announcement }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(a.createdAt).toLocaleDateString()} · by {a.createdBy}
              </p>
            </div>
            {a.pinned && (
              <Badge variant="secondary" className="gap-1">
                <Pin className="h-3 w-3" /> Pinned
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{a.body}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
