import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types";

export function BookCard({ book, hrefBase }: { book: Book; hrefBase: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
      <Link to={`${hrefBase}/${book.id}`} className="block">
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <BookOpen className="h-8 w-8" />
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <p className="truncate text-sm font-medium">{book.title}</p>
            <p className="truncate text-xs text-muted-foreground">{book.author}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">{book.category}</Badge>
              <span className="text-[10px] text-muted-foreground">{book.publicationYear}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
