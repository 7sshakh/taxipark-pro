import { AppProvider, useApp } from '@/context/AppContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { DriverManagement } from '@/components/admin/DriverManagement';
import { AdminTransactions } from '@/components/admin/AdminTransactions';
import { AdminPayouts } from '@/components/admin/AdminPayouts';
import {
  CommissionSettings, AdminAnalytics, AdminNotifications,
  AdminSettings, SystemLogs, AdminSupport
} from '@/components/admin/AdminOtherPages';
import {
  DriverLayout, DriverDashboard, DriverTransactions,
  DriverWithdraw, DriverProfile, DriverSettings
} from '@/components/driver/DriverPages';
import { LandingPage } from '@/components/LandingPage';

function AppRouter() {
  const { currentView, isAdminAuthenticated, driverMode } = useApp();

  // Landing page
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  // Admin Login
  if (currentView === 'admin_login' && !isAdminAuthenticated) {
    return <LandingPage />;
  }

  // Driver Mode
  if (driverMode) {
    return (
      <DriverLayout>
        {currentView === 'driver_dashboard' && <DriverDashboard />}
        {currentView === 'driver_transactions' && <DriverTransactions />}
        {currentView === 'driver_withdraw' && <DriverWithdraw />}
        {currentView === 'driver_profile' && <DriverProfile />}
        {currentView === 'driver_settings' && <DriverSettings />}
      </DriverLayout>
    );
  }

  // Admin Mode
  if (isAdminAuthenticated) {
    return (
      <AdminLayout>
        {currentView === 'admin_dashboard' && <AdminDashboard />}
        {currentView === 'admin_drivers' && <DriverManagement />}
        {currentView === 'admin_driver_detail' && <DriverManagement />}
        {currentView === 'admin_transactions' && <AdminTransactions />}
        {currentView === 'admin_payouts' && <AdminPayouts />}
        {currentView === 'admin_commissions' && <CommissionSettings />}
        {currentView === 'admin_analytics' && <AdminAnalytics />}
        {currentView === 'admin_notifications' && <AdminNotifications />}
        {currentView === 'admin_settings' && <AdminSettings />}
        {currentView === 'admin_logs' && <SystemLogs />}
        {currentView === 'admin_support' && <AdminSupport />}
      </AdminLayout>
    );
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
