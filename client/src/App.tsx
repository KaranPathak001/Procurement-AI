import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/Landing';
import { LoginPage, RegisterPage, OnboardingPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { VendorDashboardPage } from './pages/VendorDashboard';
import { NewProcurementPage } from './pages/NewProcurement';
import { ProcurementWorkspacePage } from './pages/ProcurementWorkspace';
import { ApprovalsPage } from './pages/Approvals';
import { PurchaseOrdersPage } from './pages/PurchaseOrders';
import { VendorsPage } from './pages/Vendors';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';

// Route guard: redirect to /login if not authenticated
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const token = localStorage.getItem('procureai_token');
  return token ? <>{element}</> : <Navigate to="/login" replace />;
};

// Route guard: redirect to /vendor/dashboard if vendor, /dashboard if buyer
const AuthRedirect: React.FC = () => {
  const token = localStorage.getItem('procureai_token');
  if (!token) return <Navigate to="/login" replace />;
  const userJson = localStorage.getItem('procureai_user');
  const user = userJson ? JSON.parse(userJson) : {};
  return user.role === 'vendor'
    ? <Navigate to="/vendor/dashboard" replace />
    : <Navigate to="/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Auto-redirect logged-in users to correct dashboard */}
        <Route path="/app" element={<AuthRedirect />} />

        {/* ── Buyer Routes ─────────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute element={<AppLayout><DashboardPage /></AppLayout>} />
          }
        />
        <Route
          path="/new-procurement"
          element={
            <PrivateRoute element={<AppLayout><NewProcurementPage /></AppLayout>} />
          }
        />
        <Route
          path="/procurements"
          element={
            <PrivateRoute element={<AppLayout><DashboardPage /></AppLayout>} />
          }
        />
        <Route
          path="/procurements/:id"
          element={
            <PrivateRoute element={<AppLayout><ProcurementWorkspacePage /></AppLayout>} />
          }
        />
        <Route
          path="/approvals"
          element={
            <PrivateRoute element={<AppLayout><ApprovalsPage /></AppLayout>} />
          }
        />
        <Route
          path="/purchase-orders"
          element={
            <PrivateRoute element={<AppLayout><PurchaseOrdersPage /></AppLayout>} />
          }
        />
        <Route
          path="/vendors"
          element={
            <PrivateRoute element={<AppLayout><VendorsPage /></AppLayout>} />
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute element={<AppLayout><AnalyticsPage /></AppLayout>} />
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute element={<AppLayout><SettingsPage /></AppLayout>} />
          }
        />

        {/* ── Vendor Routes ─────────────────────────────────────── */}
        <Route
          path="/vendor/dashboard"
          element={
            <PrivateRoute element={<AppLayout><VendorDashboardPage /></AppLayout>} />
          }
        />

        {/* Catch-all: authenticated users go to their dashboard, others to login */}
        <Route
          path="*"
          element={<AuthRedirect />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
