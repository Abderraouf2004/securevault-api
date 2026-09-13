import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileText, KeyRound, LayoutDashboard, User, Users } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from "@/routes/Guards";
import { AppShell, type NavItem } from "@/components/layout/AppShell";

import LandingPage from "@/pages/landing/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import DocumentsPage from "@/pages/client/DocumentsPage";
import SecretsPage from "@/pages/client/SecretsPage";
import ProfilePage from "@/pages/client/ProfilePage";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const clientNav: NavItem[] = [
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/secrets", label: "Secrets", icon: KeyRound },
  { to: "/app/profile", label: "Profile", icon: User },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
              <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

              <Route
                path="/app/documents"
                element={
                  <ProtectedRoute>
                    <AppShell navItems={clientNav} sectionLabel="Your vault">
                      <DocumentsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/secrets"
                element={
                  <ProtectedRoute>
                    <AppShell navItems={clientNav} sectionLabel="Your vault">
                      <SecretsPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/profile"
                element={
                  <ProtectedRoute>
                    <AppShell navItems={clientNav} sectionLabel="Your vault">
                      <ProfilePage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AppShell navItems={adminNav} sectionLabel="Admin console">
                      <AdminOverviewPage />
                    </AppShell>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AppShell navItems={adminNav} sectionLabel="Admin console">
                      <AdminUsersPage />
                    </AppShell>
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
