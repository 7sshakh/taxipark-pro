import type { Admin, Driver, Transaction, Payout, Notification, AppSettings } from './types';

export const admin: Admin = {
  id: 'admin-1',
  telegramId: 123456789,
  fullName: 'Абдуллаев Рустам',
  email: 'admin@taxipark.uz',
  role: 'super_admin',
  createdAt: new Date().toISOString(),
};

export const drivers: Driver[] = [
  {
    id: 'drv-1',
    telegramId: 111111111,
    fullName: 'Каримов Бехруз',
    phone: '+998901234567',
    carModel: 'Chevrolet Cobalt',
    carNumber: '01 A 123 AA',
    bankCardNumber: '8600 **** **** 1234',
    paymentMethod: 'click',
    status: 'active',
    balance: 2450000,
    totalEarnings: 15800000,
    totalCommission: 2370000,
    commissionRate: 15,
    todayEarnings: 320000,
    weeklyEarnings: 1850000,
    monthlyEarnings: 6800000,
    joinedAt: '2024-02-10T08:00:00Z',
    lastActiveAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'drv-2',
    telegramId: 222222222,
    fullName: 'Тошматов Сардор',
    phone: '+998911234567',
    carModel: 'Chevrolet Spark',
    carNumber: '10 B 456 BB',
    bankCardNumber: '8600 **** **** 5678',
    paymentMethod: 'payme',
    status: 'active',
    balance: 1890000,
    totalEarnings: 12400000,
    totalCommission: 1860000,
    commissionRate: 15,
    todayEarnings: 250000,
    weeklyEarnings: 1420000,
    monthlyEarnings: 5200000,
    joinedAt: '2024-03-05T09:00:00Z',
    lastActiveAt: '2025-01-15T13:45:00Z',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'txn-1',
    driverId: 'drv-1',
    driverName: 'Каримов Бехруз',
    type: 'earning',
    amount: 320000,
    commission: 48000,
    status: 'completed',
    description: 'Поездка — Аэропорт → Центр',
    createdAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'txn-2',
    driverId: 'drv-2',
    driverName: 'Тошматов Сардор',
    type: 'payout',
    amount: 1500000,
    commission: 0,
    status: 'completed',
    paymentMethod: 'payme',
    description: 'Автовыплата через Payme',
    createdAt: '2025-01-15T10:00:00Z',
  },
];

export const payouts: Payout[] = [
  {
    id: 'pay-1',
    driverId: 'drv-2',
    driverName: 'Тошматов Сардор',
    amount: 1500000,
    paymentMethod: 'payme',
    status: 'success',
    retries: 0,
    maxRetries: 3,
    transactionId: 'pm-txn-001',
    processedAt: '2025-01-15T10:01:00Z',
    createdAt: '2025-01-15T10:00:00Z',
  },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'payout',
    title: 'Выплата завершена',
    message: 'Выплата 1,500,000 сум успешно завершена',
    isRead: false,
    createdAt: '2025-01-15T10:01:00Z',
  },
];

export let appSettings: AppSettings = {
  appName: 'TaxiPark Pro',
  defaultCommissionRate: 15,
  minPayoutAmount: 50000,
  autoPayoutEnabled: true,
  autoPayoutSchedule: 'daily',
  clickMerchantId: '12345',
  clickServiceId: '67890',
  clickSecretKey: process.env.CLICK_SECRET_KEY || 'click-secret',
  paymeMerchantId: 'payme_12345',
  paymeSecretKey: process.env.PAYME_SECRET_KEY || 'payme-secret',
  telegramBotToken: process.env.BOT_TOKEN || '',
  notificationEnabled: true,
};

export function updateSettings(updates: Partial<AppSettings>) {
  appSettings = { ...appSettings, ...updates };
  return appSettings;
}

export function findDriverByTelegramId(telegramId: number) {
  return drivers.find(driver => driver.telegramId === telegramId);
}

export function findDriverById(driverId: string) {
  return drivers.find(driver => driver.id === driverId);
}

export function requestWithdrawal(driverId: string, amount: number) {
  const driver = findDriverById(driverId);
  if (!driver) return null;
  const payout: Payout = {
    id: `pay-${Date.now()}`,
    driverId: driver.id,
    driverName: driver.fullName,
    amount,
    paymentMethod: driver.paymentMethod,
    status: amount <= driver.balance ? 'processing' : 'failed',
    retries: 0,
    maxRetries: 3,
    createdAt: new Date().toISOString(),
    transactionId: amount <= driver.balance ? `txn-${Date.now()}` : undefined,
    processedAt: amount <= driver.balance ? new Date().toISOString() : undefined,
    errorMessage: amount <= driver.balance ? undefined : 'Недостаточно средств на балансе',
  };
  payouts.unshift(payout);
  if (amount <= driver.balance) {
    driver.balance -= amount;
    transactions.unshift({
      id: `txn-${Date.now()}`,
      driverId: driver.id,
      driverName: driver.fullName,
      type: 'withdrawal',
      amount,
      commission: 0,
      status: 'processing',
      paymentMethod: driver.paymentMethod,
      description: 'Запрос на вывод средств',
      createdAt: new Date().toISOString(),
    });
  }
  return payout;
}
