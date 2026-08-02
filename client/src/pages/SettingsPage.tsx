import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Users } from "lucide-react";
import { toast } from "sonner";

export function SettingsPage() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const [siteName, setSiteName] = useState("IMD Library Portal");
  const [tagline, setTagline] = useState("A modern university digital library.");
  const [footer, setFooter] = useState("© IMD Library · All resources are for academic use only.");

  // snapshot to restore on cancel
  const [snapshot, setSnapshot] = useState({ siteName, tagline, footer });

  function startEditing() {
    setSnapshot({ siteName, tagline, footer });
    setEditing(true);
  }

  function cancelEditing() {
    setSiteName(snapshot.siteName);
    setTagline(snapshot.tagline);
    setFooter(snapshot.footer);
    setEditing(false);
  }

  function saveChanges() {
    // TODO: persist to backend once a settings endpoint/collection exists
    toast.success("Settings saved");
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="System-wide configuration." />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Website</CardTitle>
          {!editing && (
            <Button variant="outline" size="sm" onClick={startEditing}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Site name</Label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} disabled={!editing} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} disabled={!editing} />
          </div>
          <div className="sm:col-span-2">
            <Label>Footer text</Label>
            <Textarea rows={2} value={footer} onChange={(e) => setFooter(e.target.value)} disabled={!editing} />
          </div>
        </CardContent>
      </Card>

      {editing && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
          <Button onClick={saveChanges}>Save changes</Button>
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Manage student profiles</p>
              <p className="text-xs text-muted-foreground">
                Edit student details or reset a student's password.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/students")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}