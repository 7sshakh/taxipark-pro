import { type ReactNode, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, ArrowLeftRight, Wallet, User, Settings, MessageSquare, CheckCircle2
} from 'lucide-react';
import type { AppView } from '@/types';

const navItems: { id: AppView; label: string; icon: ReactNode }[] = [
  { id: 'driver_dashboard', label: 'Главная', icon: <LayoutDashboard size={20} /> },
  { id: 'driver_transactions', label: 'История', icon: <ArrowLeftRight size={20} /> },
  { id: 'driver_withdraw', label: 'Вывод', icon: <Wallet size={20} /> },
  { id: 'driver_profile', label: 'Профиль', icon: <User size={20} /> },
  { id: 'driver_settings', label: 'Ещё', icon: <Settings size={20} /> },
];

export function DriverLayout({ children }: { children: ReactNode }) {
  const { currentView, setView, currentDriver, appName } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 gradient-dark text-white">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-sm">🚕</span>
            </div>
            <span className="font-bold text-sm">{appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">{currentDriver.fullName}</span>
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold">
              {currentDriver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="max-w-lg mx-auto flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 px-2 transition-colors ${
                currentView === item.id
                  ? 'text-primary-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-600" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// ==================== DRIVER DASHBOARD ====================
export function DriverDashboard() {
  const { currentDriver, setView } = useApp();
  const d = currentDriver;

  return (
    <div className="p-4 space-y-4">
      {/* Balance Card */}
      <div className="gradient-primary rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
        <p className="text-sm text-white/70 mb-1">Ваш баланс</p>
        <p className="text-3xl font-bold mb-4">{new Intl.NumberFormat('uz-UZ').format(d.balance)} сум</p>
        <div className="flex gap-2">
          <button onClick={() => setView('driver_withdraw')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
            Вывести
          </button>
          <button onClick={() => setView('driver_transactions')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
            История
          </button>
        </div>
      </div>

      {/* Earnings grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-medium">Сегодня</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{new Intl.NumberFormat('uz-UZ').format(d.todayEarnings)}</p>
          <p className="text-[10px] text-slate-400">сум</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-medium">Неделя</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{new Intl.NumberFormat('uz-UZ').format(d.weeklyEarnings)}</p>
          <p className="text-[10px] text-slate-400">сум</p>
        </div>
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-[10px] text-slate-500 uppercase font-medium">Месяц</p>
          <p className="text-lg font-bold text-slate-900 mt-1">{new Intl.NumberFormat('uz-UZ').format(d.monthlyEarnings)}</p>
          <p className="text-[10px] text-slate-400">сум</p>
        </div>
      </div>

      {/* Commission info */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Комиссия парка</span>
          <span className="text-lg font-bold text-primary-600">{d.commissionRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Способ оплаты</span>
          <span className="text-sm font-medium text-slate-900">{d.paymentMethod === 'click' ? '💳 Click' : '💳 Payme'}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Быстрые действия</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setView('driver_withdraw')} className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
            <Wallet size={18} />
            <span className="text-sm font-medium">Вывести</span>
          </button>
          <button onClick={() => setView('driver_transactions')} className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <ArrowLeftRight size={18} />
            <span className="text-sm font-medium">История</span>
          </button>
          <button onClick={() => setView('driver_profile')} className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
            <User size={18} />
            <span className="text-sm font-medium">Профиль</span>
          </button>
          <button onClick={() => setView('driver_settings')} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
            <MessageSquare size={18} />
            <span className="text-sm font-medium">Поддержка</span>
          </button>
        </div>
      </div>

      {/* Total earnings */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Общий заработок</p>
            <p className="text-xl font-bold text-slate-900">{new Intl.NumberFormat('uz-UZ').format(d.totalEarnings)} сум</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Комиссия уплачена</p>
            <p className="text-xl font-bold text-slate-400">{new Intl.NumberFormat('uz-UZ').format(d.totalCommission)} сум</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== DRIVER TRANSACTIONS ====================
export function DriverTransactions() {
  const driverTransactions = [
    { id: 'dt-1', type: 'earning' as const, amount: 320000, description: 'Поездка — Аэропорт → Центр', date: '2025-01-15T14:30:00Z', status: 'completed' as const },
    { id: 'dt-2', type: 'earning' as const, amount: 280000, description: 'Поездка — Чиланзар → Мирабад', date: '2025-01-14T18:00:00Z', status: 'completed' as const },
    { id: 'dt-3', type: 'payout' as const, amount: -2000000, description: 'Выплата через Click', date: '2025-01-13T09:00:00Z', status: 'completed' as const },
    { id: 'dt-4', type: 'earning' as const, amount: 350000, description: 'Поездка — ТТЗ → Бектемир', date: '2025-01-12T16:00:00Z', status: 'completed' as const },
    { id: 'dt-5', type: 'bonus' as const, amount: 100000, description: 'Бонус за высокую оценку', date: '2025-01-11T10:00:00Z', status: 'completed' as const },
    { id: 'dt-6', type: 'earning' as const, amount: 290000, description: 'Поездка — Олмазор → Яккасарай', date: '2025-01-10T14:00:00Z', status: 'completed' as const },
    { id: 'dt-7', type: 'earning' as const, amount: 410000, description: 'Поездка — Юнусабад → Сергели', date: '2025-01-09T11:00:00Z', status: 'completed' as const },
    { id: 'dt-8', type: 'commission' as const, amount: -48000, description: 'Комиссия 15%', date: '2025-01-15T14:30:00Z', status: 'completed' as const },
  ];

  const typeLabels: Record<string, string> = { earning: 'Заработок', commission: 'Комиссия', payout: 'Выплата', bonus: 'Бонус' };
  const typeColors: Record<string, string> = { earning: 'bg-emerald-100 text-emerald-600', commission: 'bg-orange-100 text-orange-600', payout: 'bg-blue-100 text-blue-600', bonus: 'bg-pink-100 text-pink-600' };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">История операций</h2>
      <div className="space-y-2">
        {driverTransactions.map(txn => (
          <div key={txn.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${typeColors[txn.type] || 'bg-slate-100 text-slate-600'}`}>
              {txn.type === 'earning' ? '+' : txn.type === 'bonus' ? '🎁' : txn.type === 'payout' ? '↗' : '%'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{txn.description}</p>
              <p className="text-xs text-slate-500">{typeLabels[txn.type]} • {new Date(txn.date).toLocaleDateString('ru-RU')}</p>
            </div>
            <p className={`text-sm font-bold ${txn.amount >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {txn.amount >= 0 ? '+' : ''}{new Intl.NumberFormat('uz-UZ').format(txn.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DRIVER WITHDRAW ====================
export function DriverWithdraw() {
  const { currentDriver, setView } = useApp();
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const quickAmounts = [100000, 200000, 500000, 1000000];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Вывод средств</h2>

      {success ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Запрос отправлен!</h3>
          <p className="text-sm text-slate-500 mb-4">
            Ваш запрос на вывод {new Intl.NumberFormat('uz-UZ').format(Number(amount))} сум через {currentDriver.paymentMethod === 'click' ? 'Click' : 'Payme'} обрабатывается.
          </p>
          <button onClick={() => setView('driver_dashboard')} className="w-full py-3 rounded-xl gradient-primary text-white font-semibold">
            На главную
          </button>
        </div>
      ) : (
        <>
          <div className="gradient-primary rounded-2xl p-5 text-white">
            <p className="text-sm text-white/70">Доступно для вывода</p>
            <p className="text-2xl font-bold">{new Intl.NumberFormat('uz-UZ').format(currentDriver.balance)} сум</p>
            <p className="text-xs text-white/50 mt-2">
              Через {currentDriver.paymentMethod === 'click' ? 'Click' : 'Payme'} • {currentDriver.bankCardNumber}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Сумма вывода</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Введите сумму"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
            />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {quickAmounts.map(qa => (
                <button
                  key={qa}
                  onClick={() => setAmount(qa.toString())}
                  className="py-2 rounded-lg bg-slate-50 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {new Intl.NumberFormat('uz-UZ').format(qa)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!amount || Number(amount) <= 0 || Number(amount) > currentDriver.balance || processing}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
              !amount || Number(amount) <= 0 || Number(amount) > currentDriver.balance
                ? 'bg-slate-300 cursor-not-allowed'
                : 'gradient-primary active:scale-[0.98]'
            }`}
          >
            {processing ? 'Обработка...' : `Вывести ${amount ? new Intl.NumberFormat('uz-UZ').format(Number(amount)) + ' сум' : ''}`}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Минимальная сумма вывода: 50,000 сум. Вывод обычно занимает 1-2 часа.
          </p>
        </>
      )}
    </div>
  );
}

// ==================== DRIVER PROFILE ====================
export function DriverProfile() {
  const { currentDriver } = useApp();

  const info = [
    { label: 'Полное имя', value: currentDriver.fullName },
    { label: 'Телефон', value: currentDriver.phone },
    { label: 'Автомобиль', value: currentDriver.carModel },
    { label: 'Номер авто', value: currentDriver.carNumber },
    { label: 'Способ оплаты', value: currentDriver.paymentMethod === 'click' ? 'Click' : 'Payme' },
    { label: 'Карта', value: currentDriver.bankCardNumber },
    { label: 'Комиссия', value: currentDriver.commissionRate + '%' },
    { label: 'Дата регистрации', value: new Date(currentDriver.joinedAt).toLocaleDateString('ru-RU') },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {currentDriver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <h2 className="text-xl font-bold text-slate-900">{currentDriver.fullName}</h2>
        <p className="text-sm text-slate-500">{currentDriver.carModel} • {currentDriver.carNumber}</p>
        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
          ● Активен
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {info.map((item, i) => (
          <div key={item.label} className={`flex items-center justify-between px-4 py-3 ${i < info.length - 1 ? 'border-b border-slate-50' : ''}`}>
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-sm font-medium text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DRIVER SETTINGS ====================
export function DriverSettings() {
  const { setView } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Настройки</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-900">Уведомления</p>
            <p className="text-xs text-slate-500">Получать push-уведомления</p>
          </div>
          <button
            onClick={() => setNotifEnabled(!notifEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifEnabled ? 'bg-primary-600' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${notifEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <button onClick={() => setView('driver_profile')} className="w-full flex items-center justify-between px-4 py-4 border-b border-slate-50 text-left hover:bg-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-900">Редактировать профиль</p>
            <p className="text-xs text-slate-500">Изменить данные</p>
          </div>
          <span className="text-slate-400">→</span>
        </button>
        <button className="w-full flex items-center justify-between px-4 py-4 border-b border-slate-50 text-left hover:bg-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-900">Обратиться в поддержку</p>
            <p className="text-xs text-slate-500">Связаться с администратором</p>
          </div>
          <span className="text-slate-400">→</span>
        </button>
        <button className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-slate-50">
          <div>
            <p className="text-sm font-medium text-slate-900">О приложении</p>
            <p className="text-xs text-slate-500">TaxiPark Pro v1.0.0</p>
          </div>
          <span className="text-slate-400">→</span>
        </button>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-400">TaxiPark Pro © 2025</p>
        <p className="text-xs text-slate-400">Все права защищены</p>
      </div>
    </div>
  );
}


