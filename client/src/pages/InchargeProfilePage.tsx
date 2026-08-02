import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, Pencil, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getMyProfile, updateMyProfile, uploadMyAvatar, deleteMyAvatar } from "@/api/profile";

export function InchargeProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [department, setDepartment] = useState(user?.department ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [snapshot, setSnapshot] = useState({ name, username, email, department });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarDeleting, setAvatarDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getMyProfile();
        setName(profile.name);
        setUsername(profile.username);
        setEmail(profile.email);
        setDepartment(profile.department ?? "");
        setAvatar(profile.avatar ?? "");
        setSnapshot({
          name: profile.name,
          username: profile.username,
          email: profile.email,
          department: profile.department ?? "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  if (!user) return null;
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  function startEditing() {
    setSnapshot({ name, username, email, department });
    setEditing(true);
  }

  function cancelEditing() {
    setName(snapshot.name);
    setUsername(snapshot.username);
    setEmail(snapshot.email);
    setDepartment(snapshot.department);
    setCurrentPassword("");
    setPassword("");
    setEditing(false);
  }

  function onPickAvatar() {
    fileInputRef.current?.click();
  }

  async function onAvatarSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setAvatarUploading(true);
    try {
      const res = await uploadMyAvatar(file);
      setAvatar(res.user.avatar);
      updateUser(res.user);
      toast.success("Profile picture updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to upload profile picture");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function onRemoveAvatar() {
    setAvatarDeleting(true);
    try {
      const res = await deleteMyAvatar();
      setAvatar("");
      updateUser(res.user);
      toast.success("Profile picture removed");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to remove profile picture");
    } finally {
      setAvatarDeleting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password && !currentPassword) {
      toast.error("Enter your current password to set a new one");
      return;
    }

    setLoading(true);
    try {
      const res = await updateMyProfile({
        name,
        username,
        email,
        department,
        currentPassword: password ? currentPassword : undefined,
        newPassword: password || undefined,
      });

      const usernameChanged = snapshot.username !== username;

      setCurrentPassword("");
      setPassword("");
      setEditing(false);

      if (usernameChanged) {
        toast.success("Username updated. Please log in again.");
        logout();
        navigate("/login", { replace: true });
        return;
      }

      updateUser(res.user);
      toast.success("Profile updated");
      setSnapshot({ name, username, email, department });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" description="Your account information." />
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  {avatar && <AvatarImage src={avatar} alt={user.name} />}
                  <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={onPickAvatar}
                  disabled={avatarUploading || avatarDeleting}
                  className="absolute -bottom-1 -right-1 rounded-full border border-border bg-background p-1.5 shadow hover:bg-muted disabled:opacity-50"
                  aria-label="Change profile picture"
                >
                  {avatarUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarSelected}
                />
              </div>
              <div>
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className="mt-2 capitalize" variant="secondary">{user.role}</Badge>
                {avatar && (
                  <button
                    type="button"
                    onClick={onRemoveAvatar}
                    disabled={avatarUploading || avatarDeleting}
                    className="mt-2 flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50"
                  >
                    {avatarDeleting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={startEditing} disabled={fetching}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing || fetching} />
            </div>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} disabled={!editing || fetching} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing || fetching} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} disabled={!editing || fetching} />
            </div>

            {editing && (
              <>
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
              </>
            )}

            {editing && (
              <div className="sm:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={cancelEditing} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}