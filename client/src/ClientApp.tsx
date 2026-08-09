import { useEffect, useState } from "react";
import { AppRouter } from "@/Router";

export function ClientApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <AppRouter />;
}