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
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { AnnouncementsPage } from "@/pages/AnnouncementsPage";
import { InchargesPage } from "@/pages/InchargesPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ThemesPage } from "@/pages/ThemesPage";

import { LibraryDashboard } from "@/pages/LibraryDashboard";
import { BooksPage } from "@/pages/BooksPage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { ThesisPage } from "@/pages/ThesisPage";
import { ThesisDetailPage } from "@/pages/ThesisDetailPage";
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
              <AnnouncementsPage canManage />
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
              <BooksPage hrefBase="/library/books" canManage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/books/:id"
          element={
            <RoleRoute role="incharge">
              <BookDetailPage hrefBase="/library/books" />
            </RoleRoute>
          }
        />
        <Route
          path="/library/thesis"
          element={
            <RoleRoute role="incharge">
              <ThesisPage hrefBase="/library/thesis" canManage />
            </RoleRoute>
          }
        />
        <Route
          path="/library/thesis/:id"
          element={
            <RoleRoute role="incharge">
              <ThesisDetailPage hrefBase="/library/thesis" />
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
              <AnnouncementsPage canManage />
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
              <BooksPage hrefBase="/student/books" canManage={false} />
            </RoleRoute>
          }
        />
        <Route
          path="/student/books/:id"
          element={
            <RoleRoute role="student">
              <BookDetailPage hrefBase="/student/books" />
            </RoleRoute>
          }
        />
        <Route
          path="/student/thesis"
          element={
            <RoleRoute role="student">
              <ThesisPage hrefBase="/student/thesis" canManage={false} />
            </RoleRoute>
          }
        />
        <Route
          path="/student/thesis/:id"
          element={
            <RoleRoute role="student">
              <ThesisDetailPage hrefBase="/student/thesis" />
            </RoleRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <RoleRoute role="student">
              <AnnouncementsPage canManage={false} />
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
