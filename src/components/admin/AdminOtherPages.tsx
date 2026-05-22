import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, InputField, Toggle, StatCard, EmptyState, Alert } from '@/components/ui';
import { mockCommissionSettings, mockSystemLogs, mockSupportMessages, monthlyRevenueChartData } from '@/data/mockData';
import { formatCurrency, formatCurrencyShort, formatDateTime, formatRelativeTime } from '@/utils/formatters';
import {
  Percent, BarChart3, Bell, Settings, MessageSquare,
  CheckCircle2, AlertTriangle, Info, AlertCircle, Shield, Zap,
  CreditCard, Key, Globe, Send, Save
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ==================== COMMISSION SETTINGS ====================
export function CommissionSettings() {
  const [settings, setSettings] = useState(mockCommissionSettings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const updateRate = (id: string, rate: number) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, rate } : s));
  };

  const toggleActive = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Настройки комиссий</h2>
          <p className="text-sm text-slate-500">Управление комиссионными ставками</p>
        </div>
        <Button icon={<Save size={16} />} onClick={handleSave}>
          {saved ? 'Сохранено ✓' : 'Сохранить'}
        </Button>
      </div>

      {saved && (
        <Alert variant="success" title="Настройки сохранены" message="Изменения вступят в силу для новых транзакций." onClose={() => setSaved(false)} />
      )}

      <div className="grid gap-4">
        {settings.map(setting => (
          <Card key={setting.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                    <Percent size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{setting.name}</h3>
                    <p className="text-xs text-slate-500">
                      {setting.minAmount > 0 ? `от ${formatCurrencyShort(setting.minAmount)}` : 'от 0'} до {formatCurrencyShort(setting.maxAmount)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {editingId === setting.id ? (
                    <InputField
                      value={setting.rate.toString()}
                      onChange={v => updateRate(setting.id, Number(v))}
                      type="number"
                      className="w-20"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">{setting.rate}%</span>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(editingId === setting.id ? null : setting.id)}>
                    {editingId === setting.id ? '✓' : '✎'}
                  </Button>
                </div>
                <Toggle checked={setting.isActive} onChange={() => toggleActive(setting.id)} label={setting.isActive ? 'Активна' : 'Выкл'} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ==================== ANALYTICS ====================
export function AdminAnalytics() {
  const { drivers } = useApp();

  const paymentDistribution = [
    { name: 'Click', value: drivers.filter(d => d.paymentMethod === 'click').length, color: '#3b82f6' },
    { name: 'Payme', value: drivers.filter(d => d.paymentMethod === 'payme').length, color: '#8b5cf6' },
  ];

  const driverPerformance = [...drivers].filter(d => d.status === 'active').sort((a, b) => b.monthlyEarnings - a.monthlyEarnings).slice(0, 6).map(d => ({
    name: d.fullName.split(' ')[0],
    earnings: d.monthlyEarnings,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Аналитика</h2>
        <p className="text-sm text-slate-500">Детальная статистика и отчёты</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Средний заработок" value={formatCurrencyShort(drivers.filter(d => d.status === 'active').reduce((s, d) => s + d.monthlyEarnings, 0) / drivers.filter(d => d.status === 'active').length)} subtitle="в месяц на водителя" icon={<BarChart3 size={20} />} gradient="gradient-primary" />
        <StatCard title="Общий баланс" value={formatCurrencyShort(drivers.reduce((s, d) => s + d.balance, 0))} subtitle="на руках у водителей" icon={<CreditCard size={20} />} gradient="gradient-success" />
        <StatCard title="Средняя комиссия" value="15%" subtitle="стандартная ставка" icon={<Percent size={20} />} gradient="gradient-warning" />
        <StatCard title="Конверсия" value="87%" subtitle="активных водителей" icon={<Zap size={20} />} gradient="gradient-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Доход по месяцам</h3>
          <p className="text-sm text-slate-500 mb-6">Динамика выручки</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCurrencyShort(v)} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} formatter={(value: unknown) => [formatCurrency(Number(value)), 'Доход']} />
                <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Платёжные системы</h3>
          <p className="text-sm text-slate-500 mb-4">Распределение водителей</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {paymentDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {paymentDistribution.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                <span className="text-sm text-slate-600">{p.name}: {p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Топ водителей</h3>
        <p className="text-sm text-slate-500 mb-6">По месячному заработку</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={driverPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCurrencyShort(v)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '13px' }} formatter={(value: unknown) => [formatCurrency(Number(value)), 'Месяц']} />
              <Bar dataKey="earnings" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// ==================== NOTIFICATIONS ====================
export function AdminNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  const typeIcons: Record<string, typeof Bell> = { payout: CreditCard, system: Globe, alert: AlertCircle, message: MessageSquare, warning: AlertTriangle };
  const typeColors: Record<string, string> = { payout: 'bg-blue-100 text-blue-600', system: 'bg-slate-100 text-slate-600', alert: 'bg-amber-100 text-amber-600', message: 'bg-purple-100 text-purple-600', warning: 'bg-red-100 text-red-600' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Уведомления</h2>
          <p className="text-sm text-slate-500">{unreadCount} непрочитанных</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="secondary" onClick={markAllNotificationsRead}>
            Прочитать все
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(notif => {
          const Icon = typeIcons[notif.type] || Bell;
          return (
            <Card
              key={notif.id}
              className={`p-5 transition-all cursor-pointer ${!notif.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''}`}
              onClick={() => markNotificationRead(notif.id)}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[notif.type]}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h4>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatRelativeTime(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{notif.message}</p>
                </div>
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ==================== SETTINGS ====================
export function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    appName: 'TaxiPark Pro',
    defaultCommission: '15',
    minPayout: '50000',
    autoPayoutEnabled: true,
    autoPayoutSchedule: 'daily',
    clickMerchantId: '12345',
    clickServiceId: '67890',
    clickSecretKey: '••••••••••••',
    paymeMerchantId: 'payme_12345',
    paymeSecretKey: '••••••••••••',
    botToken: '••••••••••••',
    notificationsEnabled: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Настройки системы</h2>
          <p className="text-sm text-slate-500">Конфигурация приложения и интеграций</p>
        </div>
        <Button icon={saved ? <CheckCircle2 size={16} /> : <Save size={16} />} onClick={handleSave} variant={saved ? 'success' : 'primary'}>
          {saved ? 'Сохранено ✓' : 'Сохранить'}
        </Button>
      </div>

      {saved && <Alert variant="success" title="Настройки сохранены" message="Все изменения применены." onClose={() => setSaved(false)} />}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600"><Settings size={18} /></div>
          <div>
            <h3 className="font-semibold text-slate-900">Основные настройки</h3>
            <p className="text-xs text-slate-500">Название приложения и общие параметры</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Название приложения" value={settings.appName} onChange={v => setSettings(p => ({ ...p, appName: v }))} icon={<Globe size={16} />} />
          <InputField label="Комиссия по умолчанию (%)" value={settings.defaultCommission} onChange={v => setSettings(p => ({ ...p, defaultCommission: v }))} type="number" icon={<Percent size={16} />} />
          <InputField label="Минимальная выплата (сум)" value={settings.minPayout} onChange={v => setSettings(p => ({ ...p, minPayout: v }))} type="number" icon={<CreditCard size={16} />} />
          <div className="space-y-3">
            <Toggle checked={settings.autoPayoutEnabled} onChange={v => setSettings(p => ({ ...p, autoPayoutEnabled: v }))} label="Автоматические выплаты" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><CreditCard size={18} /></div>
          <div>
            <h3 className="font-semibold text-slate-900">Click.uz Integration</h3>
            <p className="text-xs text-slate-500">Настройки платежного шлюза Click</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Merchant ID" value={settings.clickMerchantId} onChange={v => setSettings(p => ({ ...p, clickMerchantId: v }))} icon={<Key size={16} />} />
          <InputField label="Service ID" value={settings.clickServiceId} onChange={v => setSettings(p => ({ ...p, clickServiceId: v }))} icon={<Key size={16} />} />
          <InputField label="Secret Key" value={settings.clickSecretKey} onChange={v => setSettings(p => ({ ...p, clickSecretKey: v }))} type="password" icon={<Shield size={16} />} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><CreditCard size={18} /></div>
          <div>
            <h3 className="font-semibold text-slate-900">Payme Integration</h3>
            <p className="text-xs text-slate-500">Настройки платежного шлюза Payme</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Merchant ID" value={settings.paymeMerchantId} onChange={v => setSettings(p => ({ ...p, paymeMerchantId: v }))} icon={<Key size={16} />} />
          <InputField label="Secret Key" value={settings.paymeSecretKey} onChange={v => setSettings(p => ({ ...p, paymeSecretKey: v }))} type="password" icon={<Shield size={16} />} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600"><MessageSquare size={18} /></div>
          <div>
            <h3 className="font-semibold text-slate-900">Telegram Bot</h3>
            <p className="text-xs text-slate-500">Настройки Telegram бота</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Bot Token" value={settings.botToken} onChange={v => setSettings(p => ({ ...p, botToken: v }))} type="password" icon={<Key size={16} />} />
          <div className="space-y-3">
            <Toggle checked={settings.notificationsEnabled} onChange={v => setSettings(p => ({ ...p, notificationsEnabled: v }))} label="Уведомления включены" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ==================== SYSTEM LOGS ====================
export function SystemLogs() {
  const [filter, setFilter] = useState('all');

  const filtered = mockSystemLogs.filter(l => filter === 'all' || l.level === filter);
  const levelIcons: Record<string, typeof Info> = { info: Info, warning: AlertTriangle, error: AlertCircle, critical: AlertCircle };
  const levelColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-600 border-blue-200',
    warning: 'bg-amber-100 text-amber-600 border-amber-200',
    error: 'bg-red-100 text-red-600 border-red-200',
    critical: 'bg-red-200 text-red-700 border-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Системные логи</h2>
          <p className="text-sm text-slate-500">Журнал событий и ошибок</p>
        </div>
        <div className="flex gap-2">
          {['all', 'info', 'warning', 'error', 'critical'].map(level => (
            <Button key={level} size="sm" variant={filter === level ? 'primary' : 'ghost'} onClick={() => setFilter(level)}>
              {level === 'all' ? 'Все' : level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(log => {
          const Icon = levelIcons[log.level] || Info;
          const color = levelColors[log.level] || levelColors.info;
          return (
            <Card key={log.id} className={`p-4 border-l-4 ${color}`}>
              <div className="flex gap-3">
                <Icon size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-white/50">{log.level}</span>
                      <span className="text-xs text-slate-500 ml-2">{log.category}</span>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatDateTime(log.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 mt-1">{log.message}</p>
                  {log.details && <p className="text-xs text-slate-500 mt-1">{log.details}</p>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ==================== SUPPORT ====================
export function AdminSupport() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const chats = mockSupportMessages.reduce((acc, msg) => {
    if (!acc[msg.driverId]) {
      acc[msg.driverId] = { driverId: msg.driverId, driverName: msg.driverName, messages: [] };
    }
    acc[msg.driverId].messages.push(msg);
    return acc;
  }, {} as Record<string, { driverId: string; driverName: string; messages: typeof mockSupportMessages }>);

  const chatList = Object.values(chats);
  const currentChat = selectedChat ? chats[selectedChat] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Поддержка</h2>
        <p className="text-sm text-slate-500">Чат с водителями</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat list */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Диалоги</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '540px' }}>
            {chatList.map(chat => (
              <button
                key={chat.driverId}
                onClick={() => setSelectedChat(chat.driverId)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left ${
                  selectedChat === chat.driverId ? 'bg-primary-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                  {chat.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{chat.driverName}</p>
                  <p className="text-xs text-slate-500 truncate">{chat.messages[chat.messages.length - 1].message}</p>
                </div>
                <span className="text-[10px] text-slate-400">{formatRelativeTime(chat.messages[chat.messages.length - 1].createdAt)}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat area */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {currentChat.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{currentChat.driverName}</p>
                  <p className="text-xs text-slate-500">Водитель</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '440px' }}>
                {currentChat.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isAdminReply ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.isAdminReply
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                    }`}>
                      <p>{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${msg.isAdminReply ? 'text-white/60' : 'text-slate-400'}`}>
                        {formatDateTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
                <Button icon={<Send size={16} />} onClick={() => setMessage('')}>
                  Отправить
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState icon={<MessageSquare size={40} />} title="Выберите диалог" description="Выберите чат из списка слева для начала общения" />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
