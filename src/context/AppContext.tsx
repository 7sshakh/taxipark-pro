import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AppView, Driver, Notification } from '@/types';
import { mockAdmin, mockDrivers, mockNotifications, currentDriver } from '@/data/mockData';
import type { Admin } from '@/types';
import { getTelegramWebAppUser, isTelegramWebApp } from '@/utils/telegram';

interface AppContextType {
  currentView: AppView;
  setView: (view: AppView) => void;
  isAdminAuthenticated: boolean;
  isTelegramApp: boolean;
  telegramUserId: number | null;
  isTelegramAdmin: boolean;
  admin: Admin | null;
  drivers: Driver[];
  selectedDriverId: string | null;
  selectDriver: (id: string | null) => void;
  updateDriverStatus: (id: string, status: Driver['status']) => void;
  deleteDriver: (id: string) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  driverMode: boolean;
  setDriverMode: (mode: boolean) => void;
  currentDriver: Driver;
  appName: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [telegramUserId, setTelegramUserId] = useState<number | null>(null);
  const [isTelegramAdmin, setIsTelegramAdmin] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [driverMode, setDriverMode] = useState(false);

  const appName = 'TaxiPark Pro';

  useEffect(() => {
    async function loadBackendData() {
      try {
        const [driversRes, notificationsRes] = await Promise.all([
          fetch('/api/drivers'),
          fetch('/api/notifications'),
        ]);

        if (driversRes.ok) {
          setDrivers(await driversRes.json());
        }

        if (notificationsRes.ok) {
          setNotifications(await notificationsRes.json());
        }
      } catch (error) {
        console.warn('Backend load error:', error);
      }
    }
    loadBackendData();
  }, []);

  useEffect(() => {
    const telegramAdminIds = import.meta.env.VITE_ADMIN_IDS?.split(',').map(id => Number(id.trim())).filter(Boolean) ?? [];
    const telegramUser = getTelegramWebAppUser();
    const telegram = isTelegramWebApp();
    setIsTelegramApp(telegram);

    if (telegram && telegramUser?.id) {
      const userId = Number(telegramUser.id);
      setTelegramUserId(userId);
      const adminMatch = telegramAdminIds.includes(userId);
      setIsTelegramAdmin(adminMatch);

      if (adminMatch) {
        setIsAdminAuthenticated(true);
        setAdmin(mockAdmin);
        setDriverMode(false);
        setCurrentView('admin_dashboard');
      } else {
        setDriverMode(true);
        setCurrentView('driver_dashboard');
      }
    }
  }, []);

  const selectDriver = useCallback((id: string | null) => {
    setSelectedDriverId(id);
  }, []);

  const updateDriverStatus = useCallback((id: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }, []);

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const setView = useCallback((view: AppView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  }, []);

  return (
    <AppContext.Provider value={{
      currentView, setView,
      isAdminAuthenticated, isTelegramApp, telegramUserId, isTelegramAdmin, admin,
      drivers, selectedDriverId, selectDriver, updateDriverStatus, deleteDriver,
      notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
      sidebarOpen, setSidebarOpen,
      driverMode, setDriverMode,
      currentDriver: currentDriver as Driver,
      appName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
