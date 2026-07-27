import { Link, useLocation, useNavigate } from "react-router-dom";
import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Megaphone,
  Users,
  BarChart3,
  Palette,
  Settings as SettingsIcon,
  User as UserIcon,
  LogOut,
  Library,
  Moon,
  Sun,
  Menu,
  Search,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV: Record<Role, { section: string; items: NavItem[] }[]> = {
  admin: [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
        //{ label: "Analytics", to: "/admin/analytics", icon: BarChart3 },  //removed analytics page
      ],
    },
    {
      section: "Catalog",
      items: [
        { label: "Books", to: "/admin/books", icon: BookOpen },
        { label: "Thesis", to: "/admin/thesis", icon: GraduationCap },
        // { label: "Categories", to: "/library/categories", icon: Tags },
      ],
    },
    {
      section: "Management",
      items: [
        { label: "Library Incharges", to: "/admin/incharges", icon: Users },
        { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
      ],
    },
    {
      section: "System",
      items: [
        { label: "Themes", to: "/admin/themes", icon: Palette },
        { label: "Settings", to: "/admin/settings", icon: SettingsIcon },
        { label: "Profile", to: "/admin/profile", icon: UserIcon },
      ],
    },
  ],
  incharge: [
    {
      section: "Overview",
      items: [{ label: "Dashboard", to: "/library", icon: LayoutDashboard }],
    },
    {
      section: "Catalog",
      items: [
        { label: "Books", to: "/library/books", icon: BookOpen },
        { label: "Thesis", to: "/library/thesis", icon: GraduationCap },
        { label: "Categories", to: "/library/categories", icon: Tags },
      ],
    },
    {
      section: "Communication",
      items: [
        { label: "Announcements", to: "/library/announcements", icon: Megaphone },
        { label: "Profile", to: "/library/profile", icon: UserIcon },
      ],
    },
  ],
  student: [
    {
      section: "Overview",
      items: [{ label: "Dashboard", to: "/student", icon: LayoutDashboard }],
    },
    {
      section: "Explore",
      items: [
        { label: "Books", to: "/student/books", icon: BookOpen },
        { label: "Thesis", to: "/student/thesis", icon: GraduationCap },
        { label: "Announcements", to: "/student/announcements", icon: Megaphone },
      ],
    },
    {
      section: "Account",
      items: [{ label: "Profile", to: "/student/profile", icon: UserIcon }],
    },
  ],
};

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  if (!user) return null;
  const groups = NAV[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Library className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold">IMD Library</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user.role} portal</p>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.section}>
            <SidebarGroupLabel>{g.section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => {
                  const active =
                    pathname === item.to ||
                    (item.to !== "/admin" &&
                      item.to !== "/library" &&
                      item.to !== "/student" &&
                      pathname.startsWith(item.to));
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link to={item.to} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.label}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-2 text-xs text-muted-foreground">
          {!collapsed && <>v1.0 · © IMD</>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader() {
  const { user, logout } = useAuth();
  const { config, toggleMode } = useTheme();
  const navigate = useNavigate();
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
     
      <div className="ml-auto flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={toggleMode} aria-label="Toggle theme">
          {config.mode === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{user.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/${user.role === "incharge" ? "library" : user.role}`}>
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/${user.role === "incharge" ? "library" : user.role}/profile`}>
                <UserIcon className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
