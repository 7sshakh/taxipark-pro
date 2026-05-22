import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button, Badge, SearchInput, Modal, Tabs, Avatar } from '@/components/ui';
import { formatCurrencyShort, formatDate, getStatusColor, getStatusLabel } from '@/utils/formatters';
import { UserCheck, UserX, Snowflake, Trash2, Phone, Car, CreditCard, ArrowUpRight } from 'lucide-react';
import type { Driver, DriverStatus } from '@/types';

export function DriverManagement() {
  const { drivers, updateDriverStatus, deleteDriver, setView, selectDriver } = useApp();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [detailDriver, setDetailDriver] = useState<Driver | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ driver: Driver; action: string } | null>(null);

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.carNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchesTab = tab === 'all' || d.status === tab;
    return matchesSearch && matchesTab;
  });

  const statusCounts = {
    all: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    pending: drivers.filter(d => d.status === 'pending').length,
    frozen: drivers.filter(d => d.status === 'frozen').length,
    rejected: drivers.filter(d => d.status === 'rejected').length,
  };

  const handleAction = (driver: Driver, action: string) => {
    setConfirmModal({ driver, action });
  };

  const executeAction = () => {
    if (!confirmModal) return;
    const { driver, action } = confirmModal;
    const statusMap: Record<string, DriverStatus> = {
      approve: 'active',
      reject: 'rejected',
      freeze: 'frozen',
      unfreeze: 'active',
    };
    if (action === 'delete') {
      deleteDriver(driver.id);
    } else if (statusMap[action]) {
      updateDriverStatus(driver.id, statusMap[action]);
    }
    setConfirmModal(null);
    setDetailDriver(null);
  };

  const openDetail = (driver: Driver) => {
    setDetailDriver(driver);
    selectDriver(driver.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Управление водителями</h2>
          <p className="text-sm text-slate-500">Всего {drivers.length} водителей в системе</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Поиск по имени, номеру, телефону..." />
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'Все', count: statusCounts.all },
          { id: 'active', label: 'Активные', count: statusCounts.active },
          { id: 'pending', label: 'Ожидают', count: statusCounts.pending },
          { id: 'frozen', label: 'Заморожены', count: statusCounts.frozen },
          { id: 'rejected', label: 'Отклонены', count: statusCounts.rejected },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDrivers.map(driver => (
          <Card key={driver.id} hover className="p-5" onClick={() => openDetail(driver)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar name={driver.fullName} />
                <div>
                  <h4 className="font-semibold text-slate-900">{driver.fullName}</h4>
                  <p className="text-xs text-slate-500">{driver.carModel} • {driver.carNumber}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(driver.status)}>{getStatusLabel(driver.status)}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase">Баланс</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrencyShort(driver.balance)}</p>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase">Сегодня</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrencyShort(driver.todayEarnings)}</p>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase">Месяц</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrencyShort(driver.monthlyEarnings)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><CreditCard size={12} /> {driver.paymentMethod === 'click' ? 'Click' : 'Payme'}</span>
              <span>{formatDate(driver.joinedAt)}</span>
            </div>
            {driver.status === 'pending' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                <Button size="sm" variant="success" fullWidth onClick={() => handleAction(driver, 'approve')} icon={<UserCheck size={14} />}>
                  Принять
                </Button>
                <Button size="sm" variant="danger" fullWidth onClick={() => handleAction(driver, 'reject')} icon={<UserX size={14} />}>
                  Отклонить
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-400">Водители не найдены</p>
        </Card>
      )}

      {/* Driver Detail Modal */}
      <Modal isOpen={!!detailDriver} onClose={() => setDetailDriver(null)} title="Профиль водителя" size="lg">
        {detailDriver && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={detailDriver.fullName} size="lg" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{detailDriver.fullName}</h3>
                <p className="text-sm text-slate-500">{detailDriver.phone}</p>
                <Badge variant={getStatusColor(detailDriver.status)} className="mt-1">{getStatusLabel(detailDriver.status)}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Car size={16} />
                  <span className="text-sm font-medium">Автомобиль</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{detailDriver.carModel}</p>
                <p className="text-xs text-slate-500">{detailDriver.carNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <CreditCard size={16} />
                  <span className="text-sm font-medium">Оплата</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{detailDriver.paymentMethod === 'click' ? 'Click' : 'Payme'}</p>
                <p className="text-xs text-slate-500">{detailDriver.bankCardNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Phone size={16} />
                  <span className="text-sm font-medium">Телефон</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{detailDriver.phone}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-medium">Комиссия</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold">{detailDriver.commissionRate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-primary-50 rounded-xl">
                <p className="text-xs text-primary-600 font-medium">Баланс</p>
                <p className="text-lg font-bold text-primary-700">{formatCurrencyShort(detailDriver.balance)}</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-600 font-medium">Сегодня</p>
                <p className="text-lg font-bold text-emerald-700">{formatCurrencyShort(detailDriver.todayEarnings)}</p>
              </div>
              <div className="text-center p-3 bg-violet-50 rounded-xl">
                <p className="text-xs text-violet-600 font-medium">Неделя</p>
                <p className="text-lg font-bold text-violet-700">{formatCurrencyShort(detailDriver.weeklyEarnings)}</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-600 font-medium">Месяц</p>
                <p className="text-lg font-bold text-amber-700">{formatCurrencyShort(detailDriver.monthlyEarnings)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              {detailDriver.status === 'active' && (
                <>
                  <Button size="sm" variant="secondary" icon={<Snowflake size={14} />} onClick={() => handleAction(detailDriver, 'freeze')}>
                    Заморозить
                  </Button>
                  <Button size="sm" variant="primary" icon={<CreditCard size={14} />} onClick={() => { setDetailDriver(null); selectDriver(detailDriver.id); setView('admin_payouts'); }}>
                    Выплатить
                  </Button>
                </>
              )}
              {detailDriver.status === 'frozen' && (
                <Button size="sm" variant="success" icon={<UserCheck size={14} />} onClick={() => handleAction(detailDriver, 'unfreeze')}>
                  Разморозить
                </Button>
              )}
              {detailDriver.status === 'pending' && (
                <>
                  <Button size="sm" variant="success" icon={<UserCheck size={14} />} onClick={() => handleAction(detailDriver, 'approve')}>
                    Принять
                  </Button>
                  <Button size="sm" variant="danger" icon={<UserX size={14} />} onClick={() => handleAction(detailDriver, 'reject')}>
                    Отклонить
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={() => handleAction(detailDriver, 'delete')} className="text-red-500 hover:bg-red-50">
                Удалить
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal isOpen={!!confirmModal} onClose={() => setConfirmModal(null)} title="Подтверждение" size="sm">
        {confirmModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {confirmModal.action === 'approve' && `Принять водителя ${confirmModal.driver.fullName}?`}
              {confirmModal.action === 'reject' && `Отклонить водителя ${confirmModal.driver.fullName}?`}
              {confirmModal.action === 'freeze' && `Заморозить аккаунт ${confirmModal.driver.fullName}?`}
              {confirmModal.action === 'unfreeze' && `Разморозить аккаунт ${confirmModal.driver.fullName}?`}
              {confirmModal.action === 'delete' && `Удалить водителя ${confirmModal.driver.fullName}? Это действие нельзя отменить.`}
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setConfirmModal(null)}>Отмена</Button>
              <Button
                variant={confirmModal.action === 'delete' ? 'danger' : 'primary'}
                size="sm"
                onClick={executeAction}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
