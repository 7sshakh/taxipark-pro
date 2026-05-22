import { type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Users, ArrowLeftRight, CreditCard, Percent, BarChart3,
  Bell, Settings, FileText, MessageSquare, LogOut, Menu, X, Car, ChevronRight
} from 'lucide-react';
import type { AppView } from '@/types';

const navItems: { id: AppView; label: string; icon: ReactNode }[] = [
  { id: 'admin_dashboard', label: 'Дашборд', icon: <LayoutDashboard size={20} /> },
  { id: 'admin_drivers', label: 'Водители', icon: <Users size={20} /> },
  { id: 'admin_transactions', label: 'Транзакции', icon: <ArrowLeftRight size={20} /> },
  { id: 'admin_payouts', label: 'Выплаты', icon: <CreditCard size={20} /> },
  { id: 'admin_commissions', label: 'Комиссии', icon: <Percent size={20} /> },
  { id: 'admin_analytics', label: 'Аналитика', icon: <BarChart3 size={20} /> },
  { id: 'admin_notifications', label: 'Уведомления', icon: <Bell size={20} /> },
  { id: 'admin_support', label: 'Поддержка', icon: <MessageSquare size={20} /> },
  { id: 'admin_logs', label: 'Логи', icon: <FileText size={20} /> },
  { id: 'admin_settings', label: 'Настройки', icon: <Settings size={20} /> },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { currentView, setView, sidebarOpen, setSidebarOpen, logoutAdmin, unreadCount, admin, appName } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 gradient-dark text-white">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Car size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg">{appName}</h1>
              <p className="text-xs text-white/50">Панель администратора</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'admin_notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
                  {unreadCount}
                </span>
              )}
              {currentView === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-4">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
              {admin?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.fullName || 'Админ'}</p>
              <p className="text-xs text-white/40">{admin?.role === 'super_admin' ? 'Супер Админ' : 'Админ'}</p>
            </div>
          </div>
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 gradient-dark text-white animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Car size={22} />
                </div>
                <h1 className="font-bold text-lg">{appName}</h1>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.id === 'admin_notifications' && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button
                onClick={logoutAdmin}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10"
              >
                <LogOut size={18} />
                Выйти
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100">
                <Menu size={22} />
              </button>
              <h2 className="text-lg font-bold text-slate-900">
                {navItems.find(i => i.id === currentView)?.label || 'Дашборд'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('admin_notifications')}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
