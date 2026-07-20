import { PageHeader } from "@/components/shared/PageHeader";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";

export function ThemesPage() {
  return (
    <div>
      <PageHeader title="Themes" description="Customize the look and feel of the entire portal." />
      <ThemeCustomizer />
    </div>
  );
}
