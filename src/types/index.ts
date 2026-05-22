export type UserRole = 'admin' | 'super_admin' | 'driver';
export type PaymentMethod = 'click' | 'payme';
export type TransactionType = 'earning' | 'commission' | 'payout' | 'withdrawal' | 'bonus' | 'adjustment';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PayoutStatus = 'pending' | 'processing' | 'success' | 'failed' | 'retrying';
export type DriverStatus = 'active' | 'pending' | 'rejected' | 'frozen' | 'inactive';
export type NotificationType = 'payout' | 'system' | 'alert' | 'message' | 'warning';

export interface User {
  id: string;
  telegramId: number;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  telegramId: number;
  fullName: string;
  phone: string;
  carModel: string;
  carNumber: string;
  driverLicensePhoto?: string;
  passportPhoto?: string;
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
  avatarUrl?: string;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Admin {
  id: string;
  telegramId: number;
  fullName: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatarUrl?: string;
  createdAt: string;
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

export interface CommissionSetting {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  recipientId?: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  details?: string;
  createdAt: string;
}

export interface SupportMessage {
  id: string;
  driverId: string;
  driverName: string;
  message: string;
  isAdminReply: boolean;
  createdAt: string;
  isRead: boolean;
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

export interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  pendingDrivers: number;
  frozenDrivers: number;
  totalRevenue: number;
  todayRevenue: number;
  todayPayouts: number;
  failedPayouts: number;
  totalPayouts: number;
  totalCommissions: number;
  pendingPayouts: number;
}

export type AppView = 
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_drivers'
  | 'admin_driver_detail'
  | 'admin_transactions'
  | 'admin_payouts'
  | 'admin_commissions'
  | 'admin_analytics'
  | 'admin_notifications'
  | 'admin_settings'
  | 'admin_logs'
  | 'admin_support'
  | 'driver_dashboard'
  | 'driver_transactions'
  | 'driver_withdraw'
  | 'driver_profile'
  | 'driver_settings'
  | 'driver_support'
  | 'landing';
