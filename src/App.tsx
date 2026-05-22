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

function TWALoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚕</div>
        <div className="text-white text-xl font-semibold">TaxiPark Pro</div>
        <div className="text-slate-400 text-sm mt-2">Yuklanmoqda...</div>
      </div>
    </div>
  );
}

function AppRouter() {
  const { currentView, isAdminAuthenticated, driverMode, isTelegramApp } = useApp();

  // Show loading screen if not in Telegram
  if (!isTelegramApp) {
    return <TWALoadingScreen />;
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

  return <TWALoadingScreen />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
