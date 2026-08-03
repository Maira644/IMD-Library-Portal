import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { searchLibrary, recordSearch } from "@/api/search";

type ResultItem = {
  type: "book" | "thesis";
  id: string;
  title: string;
  subtitle: string;
  matchedKeyword: string | null;
};

export function GlobalSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const prefix =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "incharge"
      ? "/library"
      : "/student";

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);

      try {
        const results = await searchLibrary(query);
        setResults(results);
        setOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSelect(item: ResultItem) {
    setOpen(false);
    setQuery("");

    // Record ONLY the matched keyword
    if (item.matchedKeyword) {
      try {
        await recordSearch(item.matchedKeyword);
      } catch (err) {
        console.error("Failed to record keyword:", err);
      }
    }

    if (item.type === "book") {
      navigate(`${prefix}/books/${item.id}`);
    }

    if (item.type === "thesis") {
      navigate(`${prefix}/thesis/${item.id}`);
    }
  }

  const icons = {
    book: BookOpen,
    thesis: GraduationCap,
  };

  return (
    <div
      ref={containerRef}
      className="relative hidden max-w-sm flex-1 sm:block"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="search"
        placeholder="Search books, thesis..."
        className="pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
      />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {loading ? (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {results.map((item) => {
                const Icon = icons[item.type];

                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.title}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}