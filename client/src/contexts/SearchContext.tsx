import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SearchLog } from "@/types";

interface SearchContextValue {
  logs: SearchLog[];
  track: (keyword: string) => void;
  clear: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const track = useCallback((keyword: string) => {
    if (!keyword.trim()) return;
    setLogs((prev) => [{ keyword: keyword.trim(), timestamp: new Date().toISOString() }, ...prev].slice(0, 200));
  }, []);
  const value = useMemo(() => ({ logs, track, clear: () => setLogs([]) }), [logs, track]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchTracker() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchTracker must be used within SearchProvider");
  return ctx;
}
