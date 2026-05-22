declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand?: () => void;
        ready?: () => void;
        setBackgroundColor?: (color: string) => void;
        initData?: string;
      };
    };
  }
}

export function initTelegramWebApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  tg.ready?.();
  tg.expand?.();
  try {
    tg.setBackgroundColor?.('#0f172a');
  } catch {
    // ignore if method is missing
  }
}
