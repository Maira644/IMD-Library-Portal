import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account does not have permission to view this page.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Sign in as another user</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
