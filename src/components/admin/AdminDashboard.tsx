import { useApp } from '@/context/AppContext';
import { Card, StatCard } from '@/components/ui';
import { mockDashboardStats, revenueChartData } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort } from '@/utils/formatters';
import { Users, TrendingUp, DollarSign, AlertTriangle, CreditCard, Activity, ArrowUpRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const { drivers, setView } = useApp();
  const stats = mockDashboardStats;

  const activeDrivers = drivers.filter(d => d.status === 'active');
  const pendingDrivers = drivers.filter(d => d.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="p-6 bg-gradient-to-r from-primary-600 via-primary-500 to-violet-500 text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-32 w-40 h-40 bg-white/5 rounded-full -mb-10" />
        <div className="relative">
          <h2 className="text-2xl font-bold mb-1">Добро пожаловать! 👋</h2>
          <p className="text-white/70 text-sm">Вот что происходит с вашим такси парком сегодня.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setView('admin_payouts')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <CreditCard size={16} />
              Выплаты
            </button>
            <button onClick={() => setView('admin_drivers')} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <Users size={16} />
              Водители
            </button>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Общий доход"
          value={formatCurrencyShort(stats.totalRevenue)}
          subtitle={formatCurrency(stats.todayRevenue) + ' сегодня'}
          icon={<DollarSign size={22} />}
          trend={{ value: 12.5, positive: true }}
          gradient="gradient-primary"
        />
        <StatCard
          title="Водители"
          value={stats.totalDrivers}
          subtitle={`${stats.activeDrivers} активных`}
          icon={<Users size={22} />}
          trend={{ value: 8.3, positive: true }}
          gradient="gradient-success"
        />
        <StatCard
          title="Выплаты сегодня"
          value={formatCurrencyShort(stats.todayPayouts)}
          subtitle={`${stats.pendingPayouts} в очереди`}
          icon={<CreditCard size={22} />}
          gradient="gradient-warning"
        />
        <StatCard
          title="Ошибки выплат"
          value={stats.failedPayouts}
          subtitle="Требуют внимания"
          icon={<AlertTriangle size={22} />}
          gradient="gradient-danger"
        />
      </div>

      {/* Revenue chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Доход за неделю</h3>
              <p className="text-sm text-slate-500">Выручка и выплаты</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary-500" /> Доход</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-400" /> Выплаты</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCurrencyShort(v)} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="payouts" stroke="#a78bfa" fillOpacity={1} fill="url(#colorPayouts)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick stats */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 text-sm">Комиссии</h4>
              <Activity size={16} className="text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrencyShort(stats.totalCommissions)}</p>
            <p className="text-xs text-slate-400 mt-1">Всего собрано</p>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full" style={{ width: '68%' }} />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 text-sm">Ожидают подтверждения</h4>
              <Clock size={16} className="text-amber-500" />
            </div>
            {pendingDrivers.length === 0 ? (
              <p className="text-sm text-slate-400">Нет новых заявок</p>
            ) : (
              <div className="space-y-2">
                {pendingDrivers.map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-xs font-bold">
                      {d.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{d.fullName}</p>
                      <p className="text-xs text-slate-500">{d.carModel}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 text-sm">Топ водители</h4>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <div className="space-y-3">
              {[...activeDrivers].sort((a, b) => b.monthlyEarnings - a.monthlyEarnings).slice(0, 3).map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-600'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{d.fullName}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{formatCurrencyShort(d.monthlyEarnings)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Активные водители</h3>
          <button onClick={() => setView('admin_drivers')} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            Все водители <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDrivers.slice(0, 6).map(driver => (
            <div key={driver.id} className="p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {driver.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{driver.fullName}</p>
                  <p className="text-xs text-slate-500">{driver.carModel} • {driver.carNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600 font-medium">Сегодня</p>
                  <p className="text-sm font-bold text-emerald-700">{formatCurrencyShort(driver.todayEarnings)}</p>
                </div>
                <div className="p-2 bg-primary-50 rounded-lg">
                  <p className="text-xs text-primary-600 font-medium">Баланс</p>
                  <p className="text-sm font-bold text-primary-700">{formatCurrencyShort(driver.balance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
