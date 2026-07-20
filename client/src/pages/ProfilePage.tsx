import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ProfilePage({ editable }: { editable: boolean }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  if (!user) return null;
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Only enforce the current-password check if the user is actually
    // trying to change it (new password field isn't blank).
    if (password && !currentPassword) {
      toast.error("Enter your current password to set a new one");
      return;
    }

    // TODO: verify currentPassword against the account before accepting
    // password, then send { name, email, currentPassword, password } to the API.

    toast.success("Profile updated");
    setCurrentPassword("");
    setPassword("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" description="Your account information." />
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2 capitalize" variant="secondary">{user.role}</Badge>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} /></div>
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editable} /></div>
            <div><Label>Username</Label><Input value={user.username} disabled /></div>
            <div><Label>Department</Label><Input value={user.department ?? ""} disabled={!editable} /></div>
            {editable && (
              <div>
                <Label>Current password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Required to change password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label={showCurrentPw ? "Hide password" : "Show password"}
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            {editable && (
              <div>
                <Label>New password</Label>
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
            {editable && (
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            )}
            {!editable && (
              <p className="sm:col-span-2 text-sm text-muted-foreground">
                Student accounts are shared — profile edits are disabled.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}