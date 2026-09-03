import { Link } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

import type { Book, Thesis, Announcement } from "@/types";

import { getAllBooks } from "@/api/book";
import {
  getAllThesis,
  getMostViewedThesis,
  getFydpCountByYear,
} from "@/api/thesis";
import { getAnnouncements } from "@/api/announcement";
import { getAllIncharges } from "@/api/incharge";
import {
  getTopKeywords,
  getRecentActivity,
} from "@/api/analytics";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  books: {
    label: "Books",
    color: "var(--chart-1)",
  },
  thesis: {
    label: "Thesis",
    color: "var(--chart-2)",
  },
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [topThesis, setTopThesis] = useState<Thesis[]>([]);

  const [topKeywords, setTopKeywords] = useState<
    Array<{ keyword: string; count: number }>
  >([]);

  const [recentActivity, setRecentActivity] = useState<
    Array<{
      actor: string;
      initials: string;
      action: string;
      target: string;
      time: string;
    }>
  >([]);

  const [bookCount, setBookCount] = useState(0);
  const [digitalBooks, setDigitalBooks] = useState(0);

  const [thesisCount, setThesisCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState(0);
  const [thesisAddedThisMonth, setThesisAddedThisMonth] =
    useState(0);

  const [inchargeCount, setInchargeCount] = useState(0);
  const [activeIncharges, setActiveIncharges] = useState(0);

  // ================= FYDP BY YEAR =================

  const [selectedFydpYear, setSelectedFydpYear] =
    useState("");

  const [allFydpByYear, setAllFydpByYear] =
    useState<
      {
        year: number;
        count: number;
      }[]
    >([]);

  const fydpByYear = [...allFydpByYear]
    .sort((a, b) => b.year - a.year)
    .slice(0, 15);

  const selectedYearData = allFydpByYear.find(
    (item) =>
      item.year.toString() === selectedFydpYear
  );

  const selectedYearCount =
    selectedYearData?.count ?? 0;

  // ================= LOAD DASHBOARD DATA =================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

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

      // ================= THESIS / FYDP =================

      const thesisResponse = await getAllThesis();
      const thesis: Thesis[] = thesisResponse.thesis;

      setThesisCount(thesis.length);

      // Get real FYDP count by year
      const fydpData = await getFydpCountByYear();
      setAllFydpByYear(fydpData);

      if (fydpData.length > 0) {
        setSelectedFydpYear(
          fydpData[fydpData.length - 1].year.toString()
        );
      }

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

      const mostViewedThesis =
        await getMostViewedThesis();

      setTopThesis(mostViewedThesis);

      // ================= ANNOUNCEMENTS =================

      const announcements: Announcement[] =
        await getAnnouncements();

      setAnnouncementCount(
        announcements.length
      );

      setPinnedAnnouncements(
        announcements.filter(
          (a) => a.pinned
        ).length
      );

      // ================= INCHARGES =================

      const incharges =
        await getAllIncharges();

      setInchargeCount(
        incharges.length
      );

      setActiveIncharges(
        incharges.filter(
          (i: any) => i.active
        ).length
      );

      // ================= TOP SEARCHED KEYWORDS =================

      const keywords =
        await getTopKeywords();

      setTopKeywords(keywords);

      // ================= RECENT ACTIVITY =================

      const activity =
        await getRecentActivity();

      setRecentActivity(activity);

    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <style>{`
          @keyframes dash-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .dash-shimmer {
            background: linear-gradient(
              90deg,
              hsl(var(--muted)) 25%,
              hsl(var(--muted-foreground) / 0.25) 50%,
              hsl(var(--muted)) 75%
            );
            background-size: 200% 100%;
            animation: dash-shimmer 1.4s ease-in-out infinite;
          }
        `}</style>

        <PageHeader
          title="Admin dashboard"
          description="Overview of your library system."
        />

        <div className="flex items-center justify-center gap-2 rounded-md border bg-muted/30 py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">
            Loading dashboard...
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                <div className="h-4 w-24 rounded dash-shimmer" />
                <div className="h-7 w-16 rounded dash-shimmer" />
                <div className="h-3 w-20 rounded dash-shimmer" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="space-y-4 p-4">
            <div className="flex h-56 w-full items-end gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="dash-shimmer flex-1 rounded-t"
                  style={{ height: `${30 + ((i * 13) % 60)}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-full rounded dash-shimmer" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded dash-shimmer" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        description="Overview of your library system."
      />

      {/* ================= STAT CARDS ================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total books"
          value={bookCount}
          icon={BookOpen}
          hint={`${digitalBooks} digital`}
        />

        <StatCard
          label="Total FYDP"
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

      {/* ================= FYDP BY YEAR ================= */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            FYDP by year
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* ================= BAR CHART ================= */}

          <ChartContainer
            config={chartConfig}
            className="h-56 w-full"
          >
            <BarChart
              data={fydpByYear}
              margin={{
                top: 5,
                right: 15,
                left: 0,
                bottom: 2,
              }}
              barCategoryGap="5%"
            >
              {/* Darker horizontal grid lines */}

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#94a3b8"
              />

              <XAxis
                dataKey="year"
                tickFormatter={(value) => value.toString()}
                tick={{
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
                width={35}
              />

              <ChartTooltip
                content={
                  <ChartTooltipContent />
                }
              />

              {/* Thicker bars */}

              <Bar
                dataKey="count"
                name="FYDP"
                fill="var(--chart-1)"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ChartContainer>

          {/* ================= SELECT YEAR + RESULT ================= */}

          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                Select a year
              </span>

              <Select
                value={selectedFydpYear}
                onValueChange={
                  setSelectedFydpYear
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {allFydpByYear
                    .slice()
                    .sort((a, b) => b.year - a.year)
                    .map((item) => (
                      <SelectItem
                        key={item.year}
                        value={item.year.toString()}
                      >
                        {item.year}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {selectedYearCount}
                </p>

                <p className="text-xs text-muted-foreground">
                  FYDP submitted in{" "}
                  {selectedFydpYear}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= DASHBOARD CARDS ================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* ================= MOST VIEWED BOOKS ================= */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Most viewed books
            </CardTitle>

            <Link
              to="/admin/books"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
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

        {/* ================= MOST VIEWED FYDP ================= */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Most viewed FYDP
            </CardTitle>

            <Link
              to="/admin/thesis"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>

          <CardContent className="divide-y p-0">
            {topThesis.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4"
              >
                <div className="min-w-0">

                  {/* FYDP Title */}

                  <p className="truncate text-sm font-medium">
                    {t.title}
                  </p>

                  {/* Supervisor */}

                  <p className="truncate text-xs text-muted-foreground">
                    {t.supervisor}
                  </p>
                </div>

                {/* Views */}

                <Badge variant="secondary">
                  {t.views}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================= TOP SEARCHED KEYWORDS ================= */}

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

                <XAxis
                  type="number"
                  hide
                />

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
                  content={
                    <ChartTooltipContent />
                  }
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

      {/* ================= RECENT ACTIVITY ================= */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Recent activity
          </CardTitle>
        </CardHeader>

        <CardContent className="divide-y p-0">
          {recentActivity.map((r, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-4"
            >
              {/* Left side */}

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {r.initials}
                </div>

                <p className="truncate text-sm">
                  <span className="font-medium">
                    {r.actor}
                  </span>{" "}
                  {r.action}{" "}
                  <span className="font-medium">
                    {r.target}
                  </span>
                </p>
              </div>

              {/* Right side */}

              <span className="shrink-0 text-xs text-muted-foreground">
                {r.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}