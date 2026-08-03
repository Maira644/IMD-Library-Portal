import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Library,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import {
  validateResetToken,
  resetPassword,
} from "@/api/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordPage() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const [validToken, setValidToken] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function validate() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await validateResetToken(token);

        setValidToken(response.valid);
      } catch {
        setValidToken(false);
      } finally {
        setLoading(false);
      }
    }

    validate();
  }, [token]);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setResetting(true);

    try {
      await resetPassword(token!, password);

      toast.success("Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.detail ??
          "Unable to reset password."
      );
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">

            <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />

            <h1 className="mt-4 text-2xl font-bold">
              Invalid Reset Link
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>

            <Button
              asChild
              className="mt-6 w-full"
            >
              <Link to="/login">
                Return to Login
              </Link>
            </Button>

          </CardContent>
        </Card>
      </div>
    );
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
              Reset Password
            </h1>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Enter your new password below.
            </p>

            <form
              onSubmit={handleReset}
              className="mt-8 space-y-5"
            >
              <div className="space-y-2">
                <Label>New Password</Label>

                <div className="relative">

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              <div className="space-y-2">

                <Label>Confirm Password</Label>

                <div className="relative">

                  <Input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={resetting}
              >
                {resetting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                Reset Password
              </Button>

            </form>

          </CardContent>

        </Card>

      </motion.div>

    </div>
  );
}