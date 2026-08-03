import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Library, Loader2, GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";

const roleHome: Record<Role, string> = {
  admin: "/admin",
  incharge: "/library",
  student: "/student",
};

// Config for the role toggle. Keeping copy + demo credentials here means the
// toggle can drive both the visual state and a one-click demo autofill.
const roleOptions: {
  value: Role;
  label: string;
  icon: typeof GraduationCap;
  headline: string;
  blurb: string;
  demoUser: string;
  demoPass: string;
}[] = [
    {
      value: "student",
      label: "Student",
      icon: GraduationCap,
      headline: "A calm place to think, read, and research.",
      blurb: "Sign in to your university account to access the full digital library.",
      demoUser: "student",
      demoPass: "student123",
    },
    {
      value: "incharge",
      label: "Incharge",
      icon: Library,
      headline: "Run the library, without the busywork.",
      blurb: "Manage catalog, circulation, and members from one dashboard.",
      demoUser: "incharge",
      demoPass: "incharge123",
    },
    {
      value: "admin",
      label: "Admin",
      icon: ShieldCheck,
      headline: "Oversee every branch, in one view.",
      blurb: "Full administrative access to accounts, policy, and reporting.",
      demoUser: "admin",
      demoPass: "admin123",
    },
  ];

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") ?? undefined;

  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const active = roleOptions.find((r) => r.value === role)!;

  useEffect(() => {
    if (user) navigate(redirect ?? roleHome[user.role], { replace: true });
  }, [user, navigate, redirect]);

  function handleRoleChange(next: Role) {
  setRole(next);
  setUsername("");
  setPassword("");
  setShowPw(false);
}

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(username, password, role, remember);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      navigate(redirect ?? roleHome[u.role], { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
              <Library className="h-5 w-5" />
            </div>
            <span className="font-semibold">IMD Library</span>
          </Link>
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl font-bold leading-tight">{active.headline}</h2>
            <p className="mt-4 max-w-md text-primary-foreground/80">{active.blurb}</p>
          </motion.div>
          <div className="text-xs text-primary-foreground/70">
            {/* Demo accounts: <b>admin / admin123</b>, <b>incharge / incharge123</b>, <b>student / student123</b> */}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2 md:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Library className="h-5 w-5" />
            </div>
            <span className="font-semibold">IMD Library</span>
          </Link>
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose your role and use your pre-created account to continue.
              </p>

              {/* Role toggle */}
              <div className="relative mt-5 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                {roleOptions.map((opt) => {
                  const isActive = opt.value === role;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleRoleChange(opt.value)}
                      className={`relative z-10 flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors sm:flex-row sm:justify-center sm:gap-1.5 sm:text-sm ${isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="role-pill"
                          className="absolute inset-0 -z-10 rounded-lg bg-primary shadow-sm"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <Icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={onSubmit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>

                  {(role === "admin" || role === "incharge") && (
                    <Link
                      to="/forgot-password"
                      className="text-primary transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Button className="w-full" size="lg" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in as {active.label}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Accounts are provisioned by the administrator. Registration is not open.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
