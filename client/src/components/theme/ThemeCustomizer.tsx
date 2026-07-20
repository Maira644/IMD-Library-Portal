import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";

const HUES = [
  { name: "Royal Blue", value: 255 },
  { name: "Indigo", value: 275 },
  { name: "Teal", value: 200 },
  { name: "Emerald", value: 155 },
  { name: "Amber", value: 75 },
  { name: "Rose", value: 15 },
];

export function ThemeCustomizer() {
  const { config, update, reset } = useTheme();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Appearance</CardTitle>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <Label>Primary color</Label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {HUES.map((h) => (
              <button
                key={h.value}
                onClick={() => update({ primaryHue: h.value })}
                className={`h-10 rounded-lg border-2 transition ${
                  config.primaryHue === h.value ? "border-foreground" : "border-transparent"
                }`}
                style={{ background: `oklch(0.55 0.16 ${h.value})` }}
                title={h.name}
                aria-label={h.name}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>Border radius: {config.radius}px</Label>
          <Slider
            className="mt-4"
            min={0}
            max={20}
            step={1}
            value={[config.radius]}
            onValueChange={([v]) => update({ radius: v })}
          />
        </div>
        <div>
          <Label>Font scale: {config.fontScale.toFixed(2)}×</Label>
          <Slider
            className="mt-4"
            min={0.9}
            max={1.15}
            step={0.05}
            value={[config.fontScale]}
            onValueChange={([v]) => update({ fontScale: v })}
          />
        </div>
        <div>
          <Label>Animation speed: {config.animationSpeed.toFixed(1)}×</Label>
          <Slider
            className="mt-4"
            min={0.5}
            max={2}
            step={0.1}
            value={[config.animationSpeed]}
            onValueChange={([v]) => update({ animationSpeed: v })}
          />
        </div>
        <div>
          <Label>Sidebar style</Label>
          <Select value={config.sidebarStyle} onValueChange={(v: "solid" | "floating") => update({ sidebarStyle: v })}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="floating">Floating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Card style</Label>
          <Select value={config.cardStyle} onValueChange={(v: "flat" | "elevated") => update({ cardStyle: v })}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="elevated">Elevated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-muted-foreground">Switch the overall theme</p>
          </div>
          <Switch checked={config.mode === "dark"} onCheckedChange={(v) => update({ mode: v ? "dark" : "light" })} />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Compact mode</p>
            <p className="text-xs text-muted-foreground">Denser layout spacing</p>
          </div>
          <Switch checked={config.compact} onCheckedChange={(v) => update({ compact: v })} />
        </div>
      </CardContent>
    </Card>
  );
}
