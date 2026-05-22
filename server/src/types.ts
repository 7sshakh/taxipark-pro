export type PaymentMethod = 'click' | 'payme';
export type TransactionType = 'earning' | 'commission' | 'payout' | 'withdrawal' | 'bonus' | 'adjustment';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PayoutStatus = 'pending' | 'processing' | 'success' | 'failed' | 'retrying';
export type DriverStatus = 'active' | 'pending' | 'rejected' | 'frozen' | 'inactive';
export type NotificationType = 'payout' | 'system' | 'alert' | 'message' | 'warning';

export interface Driver {
  id: string;
  telegramId: number;
  fullName: string;
  phone: string;
  carModel: string;
  carNumber: string;
  bankCardNumber: string;
  paymentMethod: PaymentMethod;
  status: DriverStatus;
  balance: number;
  totalEarnings: number;
  totalCommission: number;
  commissionRate: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Transaction {
  id: string;
  driverId: string;
  driverName: string;
  type: TransactionType;
  amount: number;
  commission: number;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  description: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PayoutStatus;
  retries: number;
  maxRetries: number;
  transactionId?: string;
  errorMessage?: string;
  processedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppSettings {
  appName: string;
  defaultCommissionRate: number;
  minPayoutAmount: number;
  autoPayoutEnabled: boolean;
  autoPayoutSchedule: string;
  clickMerchantId: string;
  clickServiceId: string;
  clickSecretKey: string;
  paymeMerchantId: string;
  paymeSecretKey: string;
  telegramBotToken: string;
  notificationEnabled: boolean;
}

export interface Admin {
  id: string;
  telegramId: number;
  fullName: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
}
