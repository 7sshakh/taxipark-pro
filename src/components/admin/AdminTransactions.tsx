import { useState } from 'react';
import { Card, Badge, SearchInput, SelectField, Tabs } from '@/components/ui';
import { mockTransactions } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel, getTransactionTypeLabel, getTransactionTypeColor } from '@/utils/formatters';
import { ArrowUpRight, ArrowDownLeft, Gift, SlidersHorizontal, Filter } from 'lucide-react';

const typeIcons: Record<string, typeof ArrowUpRight> = {
  earning: ArrowUpRight,
  payout: ArrowDownLeft,
  withdrawal: ArrowDownLeft,
  bonus: Gift,
  commission: SlidersHorizontal,
  adjustment: SlidersHorizontal,
};

export function AdminTransactions() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = mockTransactions.filter(t => {
    const matchSearch = t.driverName.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || t.status === tab;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchTab && matchType;
  });

  const statusCounts = {
    all: mockTransactions.length,
    completed: mockTransactions.filter(t => t.status === 'completed').length,
    processing: mockTransactions.filter(t => t.status === 'processing').length,
    failed: mockTransactions.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Транзакции</h2>
          <p className="text-sm text-slate-500">История всех операций</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput value={search} onChange={setSearch} placeholder="Поиск транзакций..." />
          </div>
          <SelectField
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'all', label: 'Все типы' },
              { value: 'earning', label: 'Заработок' },
              { value: 'payout', label: 'Выплата' },
              { value: 'withdrawal', label: 'Вывод' },
              { value: 'bonus', label: 'Бонус' },
              { value: 'adjustment', label: 'Корректировка' },
            ]}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'Все', count: statusCounts.all },
          { id: 'completed', label: 'Завершены', count: statusCounts.completed },
          { id: 'processing', label: 'В процессе', count: statusCounts.processing },
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
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-4 px-5">Транзакция</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-4 px-5">Водитель</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase py-4 px-5">Тип</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase py-4 px-5">Сумма</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase py-4 px-5">Комиссия</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase py-4 px-5">Статус</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase py-4 px-5">Дата</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => {
                const Icon = typeIcons[txn.type] || ArrowUpRight;
                return (
                  <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${txn.type === 'earning' || txn.type === 'bonus' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                          <Icon size={16} />
                        </div>
                        <p className="text-sm text-slate-700 max-w-[200px] truncate">{txn.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm font-medium text-slate-900">{txn.driverName}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-sm font-medium ${getTransactionTypeColor(txn.type)}`}>
                        {getTransactionTypeLabel(txn.type)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <p className={`text-sm font-bold ${txn.amount >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                        {txn.amount >= 0 ? '+' : ''}{formatCurrency(txn.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <p className="text-sm text-slate-500">
                        {txn.commission > 0 ? formatCurrency(txn.commission) : '—'}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Badge variant={getStatusColor(txn.status)}>{getStatusLabel(txn.status)}</Badge>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <p className="text-xs text-slate-500">{formatDateTime(txn.createdAt)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Filter size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400">Транзакции не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
}
