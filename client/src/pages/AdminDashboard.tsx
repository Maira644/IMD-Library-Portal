// import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Users,
  Megaphone,
  TrendingUp,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

import type { Book, Thesis, Announcement } from "@/types";

import { getAllBooks } from "@/api/book";
import { getAllThesis, getMostViewedThesis } from "@/api/thesis";
import { getAnnouncements } from "@/api/announcement";
import { getAllIncharges } from "@/api/incharge";
import { recentActivity } from "@/data/mockAnalytics";
import { getTopKeywords } from "@/api/analytics";

const chartConfig = {
  books: { label: "Books", color: "var(--chart-1)" },
  thesis: { label: "Thesis", color: "var(--chart-2)" },
  count: { label: "Count", color: "var(--chart-1)" },
  value: { label: "Value", color: "var(--chart-1)" },
};

export function AdminDashboard() {
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [topThesis, setTopThesis] = useState<Thesis[]>([]);
  const [topKeywords, setTopKeywords] = useState<
    {
      keyword: string;
      count: number;
    }[]
  >([]);

  const [bookCount, setBookCount] = useState(0);
  const [digitalBooks, setDigitalBooks] = useState(0);

  const [thesisCount, setThesisCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState(0);
  const [thesisAddedThisMonth, setThesisAddedThisMonth] = useState(0);
  const [inchargeCount, setInchargeCount] = useState(0);
  const [activeIncharges, setActiveIncharges] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // ================= BOOKS =================
      const booksResponse = await getAllBooks();
      const books: Book[] = booksResponse.books;

      setTopBooks(
        [...books]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5)
      );

      setBookCount(books.length);

      setDigitalBooks(
        books.filter((b) => b.digitalCopy).length
      );

      // ================= THESIS =================
      const thesisResponse = await getAllThesis();
      const thesis: Thesis[] = thesisResponse.thesis;

      setThesisCount(thesis.length);

      const now = new Date();

      setThesisAddedThisMonth(
        thesis.filter((t) => {
          const upload = new Date(t.uploadDate);

          return (
            upload.getMonth() === now.getMonth() &&
            upload.getFullYear() === now.getFullYear()
          );
        }).length
      );

      const mostViewedThesis = await getMostViewedThesis();
      setTopThesis(mostViewedThesis);

      // ================= ANNOUNCEMENTS =================
      const announcements: Announcement[] = await getAnnouncements();

      setAnnouncementCount(announcements.length);

      setPinnedAnnouncements(
        announcements.filter((a) => a.pinned).length
      );

      // ================= INCHARGES =================
      const incharges = await getAllIncharges();

      setInchargeCount(incharges.length);

      setActiveIncharges(
        incharges.filter((i: any) => i.active).length
      );

      // ================= TOP SEARCHED KEYWORDS =================
      const keywords = await getTopKeywords();
      setTopKeywords(keywords);

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        description="Overview of your library system."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total books"
          value={bookCount}
          icon={BookOpen}
          hint={`${digitalBooks} digital`}
        />

        <StatCard
          label="Total thesis"
          value={thesisCount}
          icon={GraduationCap}
          hint={`${thesisAddedThisMonth} added this month`}
        />

        <StatCard
          label="Library incharges"
          value={inchargeCount}
          icon={Users}
          hint={`${activeIncharges} active`}
        />

        <StatCard
          label="Announcements"
          value={announcementCount}
          icon={Megaphone}
          hint={`${pinnedAnnouncements} pinned`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Most viewed books
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y p-0">
            {topBooks.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {b.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.author}
                  </p>
                </div>

                <Badge variant="secondary">
                  {b.views}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Most viewed thesis
            </CardTitle>
          </CardHeader>

          <CardContent className="divide-y p-0">
            {topThesis.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {t.title}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {t.studentNames.join(", ")}
                  </p>
                </div>

                <Badge variant="secondary">
                  {t.views}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top searched keywords
            </CardTitle>
          </CardHeader>

          <CardContent className="px-2">
            <ChartContainer
              config={chartConfig}
              className="h-64 w-full"
            >
              <BarChart
                data={topKeywords}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 20,
                  top: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  opacity={0.25}
                />

                <XAxis type="number" hide />

                <YAxis
                  type="category"
                  dataKey="keyword"
                  width={145}
                  tick={{
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#d1d5db",
                    strokeWidth: 1,
                  }}
                  tickLine={false}
                />

                <ChartTooltip
                  content={<ChartTooltipContent />}
                />

                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={4}
                  barSize={26}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>

        <CardContent className="divide-y p-0">
          {recentActivity.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 p-4"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {r.actor
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </div>

              <p className="flex-1 text-sm">
                <span className="font-medium">
                  {r.actor}
                </span>{" "}
                {r.action}{" "}
                <span className="font-medium">
                  {r.target}
                </span>
              </p>

              <span className="text-xs text-muted-foreground">
                {r.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}