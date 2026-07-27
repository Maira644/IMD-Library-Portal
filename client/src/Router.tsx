import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { type ReactNode } from "react";

import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";
import { AppShell } from "@/components/layout/AppShell";

import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminBooksPage } from "@/pages/AdminBooksPage";
import { AdminBookDetailsPage } from "@/pages/AdminBookDetailPage";
import { AdminThesisPage } from "./pages/AdminThesisPage";
import { AdminThesisDetailPage } from "./pages/AdminThesisDetailPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { AdminAnnouncementPage } from "@/pages/AdminAnnouncementPage";
import { InchargesPage } from "@/pages/InchargesPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ThemesPage } from "@/pages/ThemesPage";

import { LibraryDashboard } from "@/pages/LibraryDashboard";
import { InchargeBooksPage } from "@/pages/InchargeBooksPage";
import { InchargeBookDetailsPage } from "@/pages/InchargeBookDetailsPage";
import { StudentBooksPage } from "@/pages/StudentBooksPage";
import { StudentBookDetailsPage } from "@/pages/StudentBookDetailsPage";
import { InchargeThesisPage } from "@/pages/InchargeThesisPage";
import { StudentThesisPage } from "@/pages/StudentThesisPage";
import { InchargeThesisDetailPage } from "@/pages/InchargeThesisDetailPage";
import { StudentThesisDetailPage } from "@/pages/StudentThesisDetailPage";
import { InchargeAnnouncementPage } from "@/pages/InchargeAnnouncementPage";
import { StudentAnnouncementPage } from "@/pages/StudentAnnouncementPage";
import { CategoriesPage } from "@/pages/CategoriesPage";

import { StudentDashboard } from "@/pages/StudentDashboard";

/**
 * Role guard used inside the router. Redirects unauthenticated users to /login
 * and users without the required role to /unauthorized. Wraps allowed content
 * in the shared AppShell so all authenticated pages share the same chrome.
 */
function RoleRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/unauthorized" replace />;
  return <AppShell>{children}</AppShell>;
}

/**
 * Central router — every route in the app is declared here.
 * Pages live in src/pages and are rendered through this table.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <RoleRoute role="admin">
              <AdminBooksPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/books/:id"
          element={
            <RoleRoute role="admin">
              <AdminBookDetailsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/thesis"
          element={
            <RoleRoute role="admin">
              <AdminThesisPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/thesis/:id"
          element={
            <RoleRoute role="admin">
              <AdminThesisDetailPage/>
            </RoleRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RoleRoute role="admin">
              <AnalyticsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/incharges"
          element={
            <RoleRoute role="admin">
              <InchargesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <RoleRoute role="admin">
              <AdminAnnouncementPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/themes"
          element={
            <RoleRoute role="admin">
              <ThemesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RoleRoute role="admin">
              <SettingsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <RoleRoute role="admin">
              <ProfilePage editable />
            </RoleRoute>
          }
        />

        {/* Library Incharge */}
        <Route
          path="/library"
          element={
            <RoleRoute role="incharge">
              <LibraryDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/library/books"
          element={
            <RoleRoute role="incharge">
              <InchargeBooksPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/books/:id"
          element={
            <RoleRoute role="incharge">
              <InchargeBookDetailsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/thesis"
          element={
            <RoleRoute role="incharge">
              <InchargeThesisPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/thesis/:id"
          element={
            <RoleRoute role="incharge">
              <InchargeThesisDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/categories"
          element={
            <RoleRoute role="incharge">
              <CategoriesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/announcements"
          element={
            <RoleRoute role="incharge">
              <InchargeAnnouncementPage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/profile"
          element={
            <RoleRoute role="incharge">
              <ProfilePage editable />
            </RoleRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student"
          element={
            <RoleRoute role="student">
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/student/books"
          element={
            <RoleRoute role="student">
              <StudentBooksPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/books/:id"
          element={
            <RoleRoute role="student">
              <StudentBookDetailsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/thesis"
          element={
            <RoleRoute role="student">
              <StudentThesisPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/thesis/:id"
          element={
            <RoleRoute role="student">
              <StudentThesisDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <RoleRoute role="student">
              <StudentAnnouncementPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <RoleRoute role="student">
              <ProfilePage editable={false} />
            </RoleRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}