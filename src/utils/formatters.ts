export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' сум';
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' млн';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + ' тыс';
  }
  return amount.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return formatDate(dateStr);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    frozen: 'bg-blue-100 text-blue-700',
    inactive: 'bg-gray-100 text-gray-700',
    completed: 'bg-emerald-100 text-emerald-700',
    processing: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    success: 'bg-emerald-100 text-emerald-700',
    retrying: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Активен',
    pending: 'Ожидает',
    rejected: 'Отклонён',
    frozen: 'Заморожен',
    inactive: 'Неактивен',
    completed: 'Завершена',
    processing: 'Обработка',
    failed: 'Ошибка',
    success: 'Успешно',
    retrying: 'Повтор',
    cancelled: 'Отменена',
  };
  return labels[status] || status;
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    earning: 'Заработок',
    commission: 'Комиссия',
    payout: 'Выплата',
    withdrawal: 'Вывод',
    bonus: 'Бонус',
    adjustment: 'Корректировка',
  };
  return labels[type] || type;
}

export function getTransactionTypeColor(type: string): string {
  const colors: Record<string, string> = {
    earning: 'text-emerald-600',
    commission: 'text-orange-600',
    payout: 'text-blue-600',
    withdrawal: 'text-purple-600',
    bonus: 'text-pink-600',
    adjustment: 'text-gray-600',
  };
  return colors[type] || 'text-gray-600';
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function maskCardNumber(card: string): string {
  if (card.includes('*')) return card;
  return card.slice(0, 4) + ' **** **** ' + card.slice(-4);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
