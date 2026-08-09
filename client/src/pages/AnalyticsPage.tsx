// import { PageHeader } from "@/components/shared/PageHeader";
// import { StatCard } from "@/components/shared/StatCard";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BookOpen, GraduationCap, Tags, Users } from "lucide-react";
// import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { categoryDistribution, monthlyUploads, recentActivity, topKeywords } from "@/data/mockAnalytics";
// import { mockBooks } from "@/data/mockBooks";
// import { mockThesis } from "@/data/mockThesis";
// import { mockCategories } from "@/data/mockCategories";
// import { mockIncharges } from "@/data/mockIncharges";

// const cfg = {
//   books: { label: "Books", color: "var(--chart-1)" },
//   thesis: { label: "Thesis", color: "var(--chart-2)" },
//   count: { label: "Count", color: "var(--chart-1)" },
//   value: { label: "Value", color: "var(--chart-1)" },
// };

// export function AnalyticsPage() {
//   return (
//     <div>
//       <PageHeader title="Analytics" description="Metrics across the entire library system." />
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard label="Books" value={mockBooks.length} icon={BookOpen} />
//         <StatCard label="Thesis" value={mockThesis.length} icon={GraduationCap} />
//         <StatCard label="Categories" value={mockCategories.length} icon={Tags} />
//         <StatCard label="Incharges" value={mockIncharges.length} icon={Users} />
//       </div>

//       <div className="mt-6 grid gap-6 lg:grid-cols-2">
//         <Card>
//           <CardHeader><CardTitle>Monthly uploads</CardTitle></CardHeader>
//           <CardContent>
//             <ChartContainer config={cfg} className="h-72 w-full">
//               <AreaChart data={monthlyUploads}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                 <XAxis dataKey="month" /><YAxis />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//                 <Area dataKey="books" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} />
//                 <Area dataKey="thesis" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
//               </AreaChart>
//             </ChartContainer>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle>Category distribution</CardTitle></CardHeader>
//           <CardContent>
//             <ChartContainer config={cfg} className="h-72 w-full">
//               <PieChart>
//                 <Pie data={categoryDistribution} dataKey="value" nameKey="name" outerRadius={100}>
//                   {categoryDistribution.map((_, i) => <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />)}
//                 </Pie>
//                 <ChartTooltip content={<ChartTooltipContent />} />
//               </PieChart>
//             </ChartContainer>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-2">
//           <CardHeader><CardTitle>Top keywords</CardTitle></CardHeader>
//           <CardContent>
//             <ChartContainer config={cfg} className="h-72 w-full">
//               <BarChart data={topKeywords}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                 <XAxis dataKey="keyword" /><YAxis />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//                 <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
//               </BarChart>
//             </ChartContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="mt-6">
//         <CardHeader><CardTitle>Recent activities</CardTitle></CardHeader>
//         <CardContent className="divide-y p-0">
//           {recentActivity.map((r) => (
//             <div key={r.id} className="flex items-center gap-3 p-4">
//               <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
//                 {r.actor.split(" ").map((s) => s[0]).join("")}
//               </div>
//               <p className="flex-1 text-sm"><span className="font-medium">{r.actor}</span> {r.action} <span className="font-medium">{r.target}</span></p>
//               <span className="text-xs text-muted-foreground">{r.time}</span>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
