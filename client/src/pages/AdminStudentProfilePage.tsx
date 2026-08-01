import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getStudentAccount, updateStudentAccount, resetStudentPassword } from "@/api/student";

export function AdminStudentProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const student = await getStudentAccount();
        setName(student.name);
        setUsername(student.username);
        setEmail(student.email);
        setDepartment(student.department ?? "");
      } catch {
        toast.error("Failed to load student account");
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    try {
      await updateStudentAccount({
        name,
        username,
        email,
        department,
        newPassword: newPassword || undefined,
      });
      toast.success("Student account updated");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to update student account");
    } finally {
      setSaving(false);
    }
  }

  async function onResetPassword() {
    setResetting(true);
    try {
      await resetStudentPassword();
      toast.success("New password generated and emailed to student");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Failed to reset password");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate("/admin/settings")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to settings
      </Button>

      <PageHeader title="Student Account" description="Manage the shared student login." />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} disabled={fetching} /></div>
            <div><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} disabled={fetching} /></div>
            <div><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={fetching} /></div>
            <div><Label>Department</Label><Input value={department} onChange={(e) => setDepartment(e.target.value)} disabled={fetching} /></div>

            <div>
              <Label>New password</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  disabled={fetching}
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

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onResetPassword}
                disabled={resetting || fetching}
              >
                {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Forgot password? Send reset email
              </Button>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving || fetching}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}