import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Library, Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { forgotPassword } from "@/api/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      await forgotPassword(email);

      setSent(true);

      toast.success("If an account exists, a reset link has been sent.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >

        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <Card>

          <CardContent className="p-8">

            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Library className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold">
              Forgot Password
            </h1>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your registered email address and we'll send you a password
              reset link.
            </p>

            {sent ? (

              <div className="mt-8 rounded-lg border bg-muted/40 p-5 text-center">

                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />

                <h2 className="font-semibold">
                  Check your email
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists for <strong>{email}</strong>,
                  we've sent a password reset link.
                </p>

                <Button
                  asChild
                  className="mt-6 w-full"
                >
                  <Link to="/login">
                    Return to Login
                  </Link>
                </Button>

              </div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                <div className="space-y-2">

                  <Label htmlFor="email">
                    Email Address
                  </Label>

                  <div className="relative">

                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

                  </div>

                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >

                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {loading
                    ? "Sending Reset Link..."
                    : "Send Reset Link"}

                </Button>

              </form>

            )}

          </CardContent>

        </Card>

      </motion.div>

    </div>
  );
}