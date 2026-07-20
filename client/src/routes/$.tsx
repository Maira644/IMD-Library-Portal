import { createFileRoute } from "@tanstack/react-router";
import { ClientApp } from "@/ClientApp";

// Catch-all: every non-root URL is delegated to the react-router-dom app
// declared in src/router.tsx. TanStack Start only provides the SSR shell.
export const Route = createFileRoute("/$")({
  component: ClientApp,
});
