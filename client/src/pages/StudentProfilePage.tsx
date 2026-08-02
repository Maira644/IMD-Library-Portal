import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getMyProfile } from "@/api/profile";

export function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch {
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  if (!profile) return null;
  const initials = profile.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

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
              <p className="text-xl font-semibold">{profile.name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge className="mt-2 capitalize" variant="secondary">{profile.role}</Badge>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><Label>Full name</Label><Input value={profile.name} disabled /></div>
            <div><Label>Email</Label><Input value={profile.email} disabled /></div>
            <div><Label>Username</Label><Input value={profile.username} disabled /></div>
            <div><Label>Department</Label><Input value={profile.department ?? ""} disabled /></div>
            <p className="sm:col-span-2 text-sm text-muted-foreground">
              Student accounts are shared — profile edits are disabled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}