# 🚕 TaxiPark Pro — Taxi Park Management System

Professional taxi park management system for Uzbekistan with Click & Payme integration.

## 🌟 Features

### Admin Dashboard
- **Analytics Overview** — Total revenue, drivers, payouts, real-time stats
- **Driver Management** — Register, approve/reject, freeze/unfreeze drivers
- **Transaction History** — Complete transaction log with filtering and search
- **Payout Management** — Manual & automatic payouts via Click and Payme
- **Commission Settings** — Configurable commission rates
- **Analytics** — Revenue charts, driver performance, payment distribution
- **Notifications** — Real-time alerts for payouts, errors, registrations
- **Support Chat** — Direct messaging with drivers
- **System Logs** — Full audit trail of system events
- **Settings** — Click/Payme API keys, bot token, auto-payout configuration

### Driver Dashboard (TWA-style Mobile)
- **Balance Overview** — Current balance, today/weekly/monthly earnings
- **Transaction History** — Personal transaction log
- **Withdrawal** — Request payout with quick amount selection
- **Profile** — Personal info, car details, payment settings
- **Settings** — Notifications, support access

## 🔐 Demo Credentials

- **Admin Password:** `admin123`
- Click "Вход для админа" on the landing page
- Click "Открыть как водитель" for driver view

## 🏗 Architecture

```
src/
├── App.tsx                          # Main app with view routing
├── types/
│   └── index.ts                     # TypeScript type definitions
├── data/
│   └── mockData.ts                  # Mock data for demo
├── utils/
│   ├── formatters.ts                # Formatting utilities
│   └── cn.ts                        # Class name utilities
├── context/
│   └── AppContext.tsx                # Global state management
├── components/
│   ├── ui/
│   │   └── index.tsx                # Reusable UI components
│   ├── layout/
│   │   └── AdminLayout.tsx          # Admin sidebar layout
│   ├── admin/
│   │   ├── AdminDashboard.tsx       # Admin analytics dashboard
│   │   ├── DriverManagement.tsx     # Driver CRUD operations
│   │   ├── AdminTransactions.tsx    # Transaction history
│   │   ├── AdminPayouts.tsx         # Payout management
│   │   └── AdminOtherPages.tsx      # Settings, Logs, etc.
│   ├── driver/
│   │   └── DriverPages.tsx          # All driver-facing pages
│   └── LandingPage.tsx              # Landing/login page
```

## 🎯 Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Styling |
| Recharts | Charts & Analytics |
| Lucide React | Icons |
| Vite | Build Tool |

## 💳 Payment Integration Points

The system has built-in UI for configuring:

### Click.uz
- Merchant ID
- Service ID  
- Secret Key
- Payout API integration ready

### Payme
- Merchant ID
- Secret Key
- Payout API integration ready

## 📱 Telegram Web App Ready

The driver interface is designed as a mobile-first Telegram Web App (TWA) with:
- Bottom navigation bar
- Touch-friendly controls
- Telegram-style UI patterns
- Compact layout optimized for mobile

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy dist/ folder
```

## 🧩 Telegram Bot & TWA

- run `npm install`
- the bot token is already placed in `server/.env`
- admin Telegram IDs can be configured in `VITE_ADMIN_IDS` inside the root `.env` file
- run `npm run start:server` to start the backend API and Telegram bot locally
- deploy the frontend to Vercel as a static site for browser/TWA usage
- `public/manifest.webmanifest` and mobile meta tags are added so the app behaves like a standalone web app on supported devices
- note: the Telegram bot itself must run as a server process, while the browser site can be hosted separately on Vercel

## 📋 Database Schema (for production)

The TypeScript types define the complete schema:
- **users** — Base user model with Telegram auth
- **drivers** — Driver profiles with car/bank details
- **admins** — Admin users with role permissions
- **transactions** — All financial operations
- **payouts** — Payout tracking with retry logic
- **commissions** — Commission rate configuration
- **notifications** — System notifications
- **logs** — System audit logs
- **support_messages** — Driver-support chat

## 🔧 Production Backend Integration

To connect to a real backend, replace the mock data imports in:
1. `src/data/mockData.ts` → API calls
2. `src/context/AppContext.tsx` → Real state management with API hooks
3. Add environment variables for API endpoints

## 📄 Environment Variables (.env.example)

```env
# App
APP_NAME=TaxiPark Pro
APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taxipark

# Click.uz
CLICK_MERCHANT_ID=your_merchant_id
CLICK_SERVICE_ID=your_service_id
CLICK_SECRET_KEY=your_secret_key

# Payme
PAYME_MERCHANT_ID=your_merchant_id
PAYME_SECRET_KEY=your_secret_key

# Telegram
BOT_TOKEN=your_bot_token
WEB_APP_URL=https://your-domain.com/driver

# Cloudinary (optional)
CLOUDINARY_URL=your_cloudinary_url

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## 📝 License

Private — All rights reserved.
