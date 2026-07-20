import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Users, Megaphone, TrendingUp, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { mockBooks } from "@/data/mockBooks";
import { mockThesis } from "@/data/mockThesis";
import { mockIncharges } from "@/data/mockIncharges";
import { categoryDistribution, monthlyUploads, recentActivity, topKeywords } from "@/data/mockAnalytics";

const chartConfig = {
  books: { label: "Books", color: "var(--chart-1)" },
  thesis: { label: "Thesis", color: "var(--chart-2)" },
  count: { label: "Count", color: "var(--chart-1)" },
  value: { label: "Value", color: "var(--chart-1)" },
};

export function AdminDashboard() {
  const topBooks = [...mockBooks].sort((a, b) => b.views - a.views).slice(0, 5);
  const topThesis = [...mockThesis].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div>
      <PageHeader title="Admin dashboard" description="Overview of your library system." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total books" value={mockBooks.length} icon={BookOpen} trend="+12 this month" />
        <StatCard label="Total thesis" value={mockThesis.length} icon={GraduationCap} trend="+4 this month" />
        <StatCard label="Library incharges" value={mockIncharges.length} icon={Users} hint={`${mockIncharges.filter(i => i.active).length} active`} />
        <StatCard label="Announcements" value={4} icon={Megaphone} />
      </div>

      {/* <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Monthly uploads</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <AreaChart data={monthlyUploads}>
                <defs>
                  <linearGradient id="gBooks" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="books" type="monotone" stroke="var(--chart-1)" fill="url(#gBooks)" />
                <Area dataKey="thesis" type="monotone" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.1} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Category distribution</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div> */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> Most viewed books</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {topBooks.map((b) => (
              <Link key={b.id} to={`/admin/analytics`} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{b.title}</p><p className="truncate text-xs text-muted-foreground">{b.author}</p></div>
                <Badge variant="secondary">{b.views}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> Most viewed thesis</CardTitle></CardHeader>
          <CardContent className="divide-y p-0">
            {topThesis.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{t.title}</p><p className="truncate text-xs text-muted-foreground">{t.studentNames.join(", ")}</p></div>
                <Badge variant="secondary">{t.views}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Top searched keywords</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={topKeywords} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="keyword" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="divide-y p-0">
          {recentActivity.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {r.actor.split(" ").map((s) => s[0]).join("")}
              </div>
              <p className="flex-1 text-sm">
                <span className="font-medium">{r.actor}</span> {r.action}{" "}
                <span className="font-medium">{r.target}</span>
              </p>
              <span className="text-xs text-muted-foreground">{r.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
