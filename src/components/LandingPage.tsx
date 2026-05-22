import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button, InputField, Alert } from '@/components/ui';
import { Car, Shield, Zap, Lock, ArrowRight, Smartphone, BarChart3 } from 'lucide-react';

export function LandingPage() {
  const { loginAdmin, setView, setDriverMode } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (loginAdmin(password)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const openDriverMode = () => {
    setDriverMode(true);
    setView('driver_dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Car size={22} />
            </div>
            <span className="font-bold text-xl">TaxiPark Pro</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={openDriverMode} className="text-white/70 hover:text-white hover:bg-white/10">
              <Smartphone size={16} />
              Водитель
            </Button>
            <Button onClick={() => setShowLogin(true)} className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
              <Lock size={16} />
              Вход для админа
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm text-white/70 mb-6">
            <Zap size={14} className="text-yellow-400" />
            Система управления такси парком #1 в Узбекистане
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Управляйте вашим
            <span className="bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent"> такси парком </span>
            эффективно
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Полная автоматизация: управление водителями, сбор комиссий, мгновенные выплаты через Click и Payme. Всё в одном месте.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => setShowLogin(true)} className="gradient-primary text-white border-0 shadow-lg shadow-primary-500/30">
              Начать работу
              <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="ghost" onClick={openDriverMode} className="text-white/70 hover:text-white hover:bg-white/10 border border-white/20">
              <Smartphone size={18} />
              Открыть как водитель
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <Car size={22} />
            </div>
            <h3 className="font-bold mb-2">Управление водителями</h3>
            <p className="text-sm text-white/50">Регистрация, верификация, отслеживание активности и баланс каждого водителя</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center mx-auto mb-4">
              <Zap size={22} />
            </div>
            <h3 className="font-bold mb-2">Автоматические выплаты</h3>
            <p className="text-sm text-white/50">Интеграция с Click и Payme для мгновенных выплат водителям</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl gradient-warning flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={22} />
            </div>
            <h3 className="font-bold mb-2">Аналитика и отчёты</h3>
            <p className="text-sm text-white/50">Детальная статистика доходов, комиссий и эффективности парка</p>
          </div>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-16 text-xs text-white/40">
          <span className="px-3 py-1.5 rounded-lg bg-white/5">Telegram Bot</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5">Click.uz API</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5">Payme API</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5">PostgreSQL</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5">Prisma ORM</span>
          <span className="px-3 py-1.5 rounded-lg bg-white/5">Real-time</span>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Shield size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Вход для администратора</h2>
                <p className="text-sm text-slate-500 mt-1">Введите пароль для доступа к панели управления</p>
              </div>

              {error && (
                <div className="mb-4">
                  <Alert variant="error" title="Ошибка входа" message="Неверный пароль. Попробуйте ещё раз." />
                </div>
              )}

              <div className="space-y-4">
                <InputField
                  label="Пароль"
                  value={password}
                  onChange={setPassword}
                  type="password"
                  placeholder="Введите пароль"
                  icon={<Lock size={16} />}
                />
                <Button fullWidth size="lg" onClick={handleLogin} icon={<ArrowRight size={16} />}>
                  Войти
                </Button>
              </div>

              <p className="text-xs text-center text-slate-400 mt-6">
                Демо пароль: <span className="font-mono text-primary-600">admin123</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
