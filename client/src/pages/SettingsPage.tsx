import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SettingsPage() {
  const [siteName, setSiteName] = useState("IMD Library Portal");
  const [tagline, setTagline] = useState("A modern university digital library.");
  const [announcementsEnabled, setAnnouncementsEnabled] = useState(true);
  const [publicCatalog, setPublicCatalog] = useState(false);
  const [footer, setFooter] = useState("© IMD Library · All resources are for academic use only.");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="System-wide configuration." />
      <Card>
        <CardHeader><CardTitle>Website</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div><Label>Site name</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Footer text</Label><Textarea rows={2} value={footer} onChange={(e) => setFooter(e.target.value)} /></div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader><CardTitle>Features</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="Enable announcements" hint="Show announcements section across dashboards" checked={announcementsEnabled} onChange={setAnnouncementsEnabled} />
          <Row label="Public catalog" hint="Allow non-authenticated users to browse the catalog" checked={publicCatalog} onChange={setPublicCatalog} />
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}

function Row({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{hint}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
