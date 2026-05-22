import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Badge, Modal, StatCard, Tabs, SelectField, Alert } from '@/components/ui';
import { mockPayouts, mockDashboardStats } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '@/utils/formatters';
import { CreditCard, RefreshCw, CheckCircle2, Clock, AlertTriangle, Send, Zap, Loader2 } from 'lucide-react';

export function AdminPayouts() {
  const { drivers } = useApp();
  const [tab, setTab] = useState('all');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [payoutMethod, setPayoutMethod] = useState('click');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const filtered = mockPayouts.filter(p => tab === 'all' || p.status === tab);
  const statusCounts = {
    all: mockPayouts.length,
    pending: mockPayouts.filter(p => p.status === 'pending').length,
    processing: mockPayouts.filter(p => p.status === 'processing').length,
    success: mockPayouts.filter(p => p.status === 'success').length,
    failed: mockPayouts.filter(p => p.status === 'failed').length,
  };

  const activeDrivers = drivers.filter(d => d.status === 'active' && d.balance > 0);

  const toggleDriver = (id: string) => {
    setSelectedDrivers(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedDrivers(activeDrivers.map(d => d.id));
  };

  const processPayout = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setResult({ success: selectedDrivers.length, failed: 0 });
      setShowPayoutModal(false);
      setShowAutoModal(false);
    }, 2000);
  };

  const retryPayout = (id: string) => {
    console.log('Retrying payout:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Управление выплатами</h2>
          <p className="text-sm text-slate-500">Выплаты через Click и Payme</p>
        </div>
        <div className="flex gap-2">
          <Button icon={<Send size={16} />} onClick={() => { setShowPayoutModal(true); setResult(null); setSelectedDrivers([]); }}>
            Выплата
          </Button>
          <Button variant="success" icon={<Zap size={16} />} onClick={() => { setShowAutoModal(true); setResult(null); setSelectedDrivers([]); selectAll(); }}>
            Авто-выплата
          </Button>
        </div>
      </div>

      {result && (
        <Alert
          variant={result.failed > 0 ? 'warning' : 'success'}
          title="Выплата обработана"
          message={`Успешно: ${result.success}, Ошибки: ${result.failed}`}
          onClose={() => setResult(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Сегодня выплачено" value={formatCurrency(mockDashboardStats.todayPayouts)} icon={<CreditCard size={20} />} gradient="gradient-primary" />
        <StatCard title="В очереди" value={statusCounts.pending + statusCounts.processing} icon={<Clock size={20} />} gradient="gradient-warning" />
        <StatCard title="Успешные" value={statusCounts.success} icon={<CheckCircle2 size={20} />} gradient="gradient-success" />
        <StatCard title="Ошибки" value={statusCounts.failed} icon={<AlertTriangle size={20} />} gradient="gradient-danger" />
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'Все', count: statusCounts.all },
          { id: 'pending', label: 'Ожидают', count: statusCounts.pending },
          { id: 'processing', label: 'В процессе', count: statusCounts.processing },
          { id: 'success', label: 'Успешные', count: statusCounts.success },
          { id: 'failed', label: 'Ошибки', count: statusCounts.failed },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-4 px-5">ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-4 px-5">Водитель</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase py-4 px-5">Сумма</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase py-4 px-5">Метод</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase py-4 px-5">Статус</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase py-4 px-5">Попытки</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase py-4 px-5">Дата</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase py-4 px-5">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(payout => (
                <tr key={payout.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-xs font-mono text-slate-500">{payout.id}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {payout.driverName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{payout.driverName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(payout.amount)}</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <Badge variant={payout.paymentMethod === 'click' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                      {payout.paymentMethod === 'click' ? 'Click' : 'Payme'}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <Badge variant={getStatusColor(payout.status)}>{getStatusLabel(payout.status)}</Badge>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="text-sm text-slate-500">{payout.retries}/{payout.maxRetries}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="text-xs text-slate-500">{formatDateTime(payout.createdAt)}</span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {(payout.status === 'failed' || payout.status === 'retrying') && (
                      <Button size="sm" variant="ghost" onClick={() => retryPayout(payout.id)} icon={<RefreshCw size={14} />}>
                        Повтор
                      </Button>
                    )}
                    {payout.status === 'success' && (
                      <CheckCircle2 size={18} className="mx-auto text-emerald-500" />
                    )}
                    {payout.status === 'pending' && (
                      <Clock size={18} className="mx-auto text-amber-500" />
                    )}
                    {payout.status === 'processing' && (
                      <Loader2 size={18} className="mx-auto text-blue-500 animate-spin" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Payout Modal */}
      <Modal isOpen={showPayoutModal} onClose={() => setShowPayoutModal(false)} title="Ручная выплата" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Выберите водителей для выплаты:</p>
          <SelectField
            label="Способ оплаты"
            value={payoutMethod}
            onChange={setPayoutMethod}
            options={[
              { value: 'click', label: 'Click' },
              { value: 'payme', label: 'Payme' },
              { value: 'auto', label: 'Авто (по настройкам водителя)' },
            ]}
          />
          <div className="flex justify-end">
            <Button size="sm" variant="ghost" onClick={selectAll}>Выбрать всех</Button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {activeDrivers.map(driver => (
              <label
                key={driver.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedDrivers.includes(driver.id) ? 'border-primary-300 bg-primary-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDrivers.includes(driver.id)}
                  onChange={() => toggleDriver(driver.id)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{driver.fullName}</p>
                    <p className="text-xs text-slate-500">{driver.paymentMethod === 'click' ? 'Click' : 'Payme'} • {driver.bankCardNumber}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(driver.balance)}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Выбрано: {selectedDrivers.length} • Сумма: {formatCurrency(activeDrivers.filter(d => selectedDrivers.includes(d.id)).reduce((s, d) => s + d.balance, 0))}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowPayoutModal(false)}>Отмена</Button>
              <Button onClick={processPayout} disabled={selectedDrivers.length === 0 || processing} icon={processing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}>
                {processing ? 'Обработка...' : 'Выплатить'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Auto Payout Modal */}
      <Modal isOpen={showAutoModal} onClose={() => setShowAutoModal(false)} title="Автоматическая выплата" size="md">
        <div className="space-y-4">
          <Alert variant="info" title="Автоматическая выплата" message="Система автоматически отправит выплаты через Click и Payme для всех выбранных водителей. При ошибке будет выполнено до 3 повторных попыток." />
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <p className="text-sm font-medium text-slate-700">Выбрано водителей: {selectedDrivers.length}</p>
            <p className="text-sm text-slate-600">Общая сумма: {formatCurrency(activeDrivers.filter(d => selectedDrivers.includes(d.id)).reduce((s, d) => s + d.balance, 0))}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowAutoModal(false)}>Отмена</Button>
            <Button variant="success" onClick={processPayout} disabled={selectedDrivers.length === 0 || processing} icon={processing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}>
              {processing ? 'Запуск...' : 'Запустить авто-выплату'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
