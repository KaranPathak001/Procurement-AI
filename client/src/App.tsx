import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/Landing';
import { LoginPage, RegisterPage, OnboardingPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { NewProcurementPage } from './pages/NewProcurement';
import { ProcurementWorkspacePage } from './pages/ProcurementWorkspace';
import { ApprovalsPage } from './pages/Approvals';
import { PurchaseOrdersPage } from './pages/PurchaseOrders';
import { VendorsPage } from './pages/Vendors';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Workspace App Routes */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/new-procurement"
          element={
            <AppLayout>
              <NewProcurementPage />
            </AppLayout>
          }
        />
        <Route
          path="/procurements"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/procurements/:id"
          element={
            <AppLayout>
              <ProcurementWorkspacePage />
            </AppLayout>
          }
        />
        <Route
          path="/approvals"
          element={
            <AppLayout>
              <ApprovalsPage />
            </AppLayout>
          }
        />
        <Route
          path="/purchase-orders"
          element={
            <AppLayout>
              <PurchaseOrdersPage />
            </AppLayout>
          }
        />
        <Route
          path="/vendors"
          element={
            <AppLayout>
              <VendorsPage />
            </AppLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
