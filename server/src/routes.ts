import { Router } from 'express';
import { admin, drivers, transactions, payouts, notifications, appSettings, updateSettings, findDriverById, requestWithdrawal } from './data';

export const router = Router();

router.get('/status', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ authenticated: true, admin, token: 'demo-admin-token' });
  }
  res.status(401).json({ authenticated: false, message: 'Invalid password' });
});

router.get('/drivers', (_req, res) => {
  res.json(drivers);
});

router.get('/drivers/:id', (req, res) => {
  const driver = findDriverById(req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json(driver);
});

router.get('/transactions', (_req, res) => {
  res.json(transactions);
});

router.get('/payouts', (_req, res) => {
  res.json(payouts);
});

router.get('/notifications', (_req, res) => {
  res.json(notifications);
});

router.get('/settings', (_req, res) => {
  res.json(appSettings);
});

router.post('/settings', (req, res) => {
  const updated = updateSettings(req.body);
  res.json(updated);
});

router.post('/withdraw', (req, res) => {
  const { driverId, amount } = req.body;
  if (!driverId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'driverId and amount are required' });
  }
  const payout = requestWithdrawal(driverId, amount);
  if (!payout) return res.status(404).json({ error: 'Driver not found' });
  res.json(payout);
});
