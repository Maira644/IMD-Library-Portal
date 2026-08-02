import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Search,
  Library,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  ClipboardCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getAllBooks } from "@/api/book";
import { getAllThesis } from "@/api/thesis";
import { getAnnouncements } from "@/api/announcement";
import { getCategories } from "@/api/category";
import type { Role } from "@/types";

interface PreviewItem {
  id: string;
  title: string;
  sub: string;
}

function dashboardPath(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "incharge") return "/library";
  return "/student";
}

function bookDetailPath(role: Role, id: string) {
  if (role === "admin") return `/admin/books/${id}`;
  if (role === "incharge") return `/library/books/${id}`;
  return `/student/books/${id}`;
}

function thesisDetailPath(role: Role, id: string) {
  if (role === "admin") return `/admin/thesis/${id}`;
  if (role === "incharge") return `/library/thesis/${id}`;
  return `/student/thesis/${id}`;
}

function announcementsPath(role: Role) {
  if (role === "admin") return "/admin/announcements";
  if (role === "incharge") return "/library/announcements";
  return "/student/announcements";
}

function booksListPath(role: Role) {
  if (role === "admin") return "/admin/books";
  if (role === "incharge") return "/library/books";
  return "/student/books";
}

export function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<PreviewItem[]>([]);
  const [thesis, setThesis] = useState<PreviewItem[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [booksTotal, setBooksTotal] = useState(0);
  const [thesisTotal, setThesisTotal] = useState(0);
  const [categoriesTotal, setCategoriesTotal] = useState(0);

  const [booksLoading, setBooksLoading] = useState(true);
  const [thesisLoading, setThesisLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState(!!user);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllBooks();
        const all = data.books ?? [];
        setBooksTotal(all.length);
        const list = all.slice(0, 4).map((b: any) => ({
          id: b.id,
          title: b.title,
          sub: b.author,
        }));
        setBooks(list);
      } catch {
        setBooks([]);
      } finally {
        setBooksLoading(false);
      }
    })();

    (async () => {
      try {
        const data = await getAllThesis();
        const all = data.thesis ?? [];
        setThesisTotal(all.length);
        const list = all.slice(0, 4).map((t: any) => ({
          id: t.id,
          title: t.title,
          sub: Array.isArray(t.studentNames) ? t.studentNames.join(", ") : t.studentNames,
        }));
        setThesis(list);
      } catch {
        setThesis([]);
      } finally {
        setThesisLoading(false);
      }
    })();

    (async () => {
      try {
        const categories = await getCategories();
        setCategoriesTotal(categories?.length ?? 0);
      } catch {
        setCategoriesTotal(0);
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) {
      setAnnouncements([]);
      setAnnouncementsLoading(false);
      return;
    }

    setAnnouncementsLoading(true);
    (async () => {
      try {
        const list = await getAnnouncements();
        setAnnouncements(list.slice(0, 2));
      } catch {
        setAnnouncements([]);
      } finally {
        setAnnouncementsLoading(false);
      }
    })();
  }, [user]);

  function handleBookClick(id: string) {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(bookDetailPath(user.role, id));
  }

  function handleThesisClick(id: string) {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(thesisDetailPath(user.role, id));
  }

  function handleAnnouncementsClick() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(announcementsPath(user.role));
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    const path = booksListPath(user.role);
    navigate(searchTerm.trim() ? `${path}?search=${encodeURIComponent(searchTerm.trim())}` : path);
  }

  function handlePrimaryCta() {
    if (user) {
      navigate(dashboardPath(user.role));
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-background to-background" />

        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:pt-24">
          <div className="grid gap-12 md:grid-cols-[1fr_320px] md:items-start">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
                <span className="h-px w-6 bg-primary/50" />
                Catalog No. 000.1 — University Digital Library
              </div>

              <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-7xl">
                Knowledge,
                <br />
                <span className="text-primary">elegantly organized.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Every book, thesis, and academic resource — cataloged, cross-referenced, and one search away.
              </p>

              <form className="mt-9 max-w-md" onSubmit={handleSearchSubmit}>
                <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Search request
                </label>
                <div className="mt-2 flex items-center gap-3 border-b-2 border-foreground/70 pb-2 focus-within:border-primary">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Title, author, keyword…"
                    className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </div>
                <Button type="submit" size="lg" className="group mt-5">
                  {user ? "Search catalog" : "Sign in to search"}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: -3, y: 20 }}
              animate={{ opacity: 1, rotate: -2, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ rotate: 0 }}
              className="mx-auto w-full max-w-xs rounded-sm border border-border bg-[hsl(var(--card))] p-6 shadow-lg md:mt-2"
            >
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Accession Record
              </p>
              <div className="mt-4 space-y-3 font-mono text-sm">
                <CatalogRow label="Books" value={booksLoading ? "…" : `${booksTotal}+`} />
                <CatalogRow label="Thesis" value={thesisLoading ? "…" : `${thesisTotal}+`} />
                <CatalogRow label="Categories" value={categoriesLoading ? "…" : `${categoriesTotal}`} />
                <CatalogRow label="Department" value="IMD" />
              </div>
              <div className="mt-6 flex gap-[3px]">
                {[3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1].map((w, i) => (
                  <div key={i} className="bg-foreground/70" style={{ width: w, height: 28 }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">Everything a modern library needs</h2>
        <p className="mt-2 text-muted-foreground">Built for students, curated by librarians, governed by admins.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { tag: "A", icon: BookOpen, title: "Rich catalog", desc: "Books & thesis with metadata, previews, and PDFs." },
            { tag: "B", icon: Search, title: "Instant search", desc: "Autocomplete, keyword matching, filters and sorting." },
            { tag: "C", icon: ShieldCheck, title: "Role-based access", desc: "Admin, Incharge, Student — each with tailored tools." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/60">{f.tag}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-2 text-muted-foreground">From sign-in to your next read, in three steps.</p>
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
            {[
              { num: "01", icon: UserPlus, title: "Sign in to your account", desc: "Use your university-provisioned account — no self-registration needed." },
              { num: "02", icon: Search, title: "Find what you need", desc: "Search the full catalog of books and thesis with instant filters." },
              { num: "03", icon: ClipboardCheck, title: "Borrow & track", desc: "Request items and keep an eye on due dates from your dashboard." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="relative z-10 mb-4 grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-sm font-semibold text-primary shadow-sm">
                  {step.num}
                </div>
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Previews */}
      <section id="catalog" className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <PreviewList
              title="Latest books"
              icon={BookOpen}
              items={books}
              loading={booksLoading}
              emptyLabel="No books available yet."
              onItemClick={handleBookClick}
            />
            <PreviewList
              title="Latest thesis"
              icon={GraduationCap}
              items={thesis}
              loading={thesisLoading}
              emptyLabel="No thesis available yet."
              onItemClick={handleThesisClick}
            />
          </div>

          <div id="announcements" className="mt-10">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Announcements</h3>
            </div>

            {!user ? (
              <Card>
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <p className="text-sm text-muted-foreground">Sign in to view the latest announcements.</p>
                  <Button size="sm" onClick={() => navigate("/login")}>Sign in</Button>
                </CardContent>
              </Card>
            ) : announcementsLoading ? (
              <p className="text-sm text-muted-foreground">Loading announcements…</p>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {announcements.map((a) => (
                  <Card
                    key={a.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={handleAnnouncementsClick}
                  >
                    <CardContent className="p-5">
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">Announcement</p>
                      <p className="mt-1 font-semibold">{a.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <CardContent className="relative grid gap-6 p-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold">Ready to explore the library?</h2>
              <p className="mt-2 text-primary-foreground/80">
                {user
                  ? "Jump back into your dashboard to pick up where you left off."
                  : "Sign in with your university account to access the full catalog."}
              </p>
            </div>
            <Button size="lg" variant="secondary" className="group w-fit" onClick={handlePrimaryCta}>
              {user ? "Go to dashboard" : "Sign in"}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      <PublicFooter />
    </div>
  );
}

function CatalogRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="whitespace-nowrap text-muted-foreground">{label}</span>
      <span className="flex-1 border-b border-dotted border-muted-foreground/40 translate-y-[-3px]" />
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function PreviewList({
  title,
  icon: Icon,
  items,
  loading,
  emptyLabel,
  onItemClick,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: PreviewItem[];
  loading: boolean;
  emptyLabel: string;
  onItemClick: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <Card>
        <CardContent className="divide-y p-0">
          {loading ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            items.map((i) => (
              <button
                key={i.id}
                onClick={() => onItemClick(i.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{i.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.sub}</p>
                </div>
                <Badge variant="outline">{i.id}</Badge>
              </button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PublicHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">IMD Library</p>
            <p className="text-xs text-muted-foreground">University Portal</p>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#catalog" className="transition-colors hover:text-foreground">Catalog</a>
          <a href="#announcements" className="transition-colors hover:text-foreground">Announcements</a>
        </nav>
        <Button asChild>
          <Link to={user ? dashboardPath(user.role) : "/login"}>
            {user ? "Dashboard" : "Sign in"}
          </Link>
        </Button>
      </div>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} IMD Library Portal. All rights reserved.</p>
        <p>Built for students, incharges, and administrators.</p>
      </div>
    </footer>
  );
}