declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand?: () => void;
        ready?: () => void;
        setBackgroundColor?: (color: string) => void;
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id?: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
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

export function isTelegramWebApp() {
  return Boolean(window.Telegram?.WebApp);
}

export function getTelegramWebAppUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
}
