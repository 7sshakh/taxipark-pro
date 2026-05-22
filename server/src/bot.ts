import { Telegraf } from 'telegraf';
import { findDriverByTelegramId, admin, drivers } from './data';

export function initTelegramBot() {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    console.info('Telegram bot disabled: BOT_TOKEN is not set.');
    return;
  }

  const bot = new Telegraf(token);

  bot.start(async ctx => {
    const telegramId = ctx.from?.id;
    const driver = telegramId ? findDriverByTelegramId(telegramId) : undefined;
    if (driver) {
      await ctx.reply(
        `Добро пожаловать, ${driver.fullName}!\n
Баланс: ${driver.balance.toLocaleString('ru-RU')} сум\n` +
        `Вы можете отправить /balance, /withdraw <сумма> или /profile.`
      );
      return;
    }

    if (telegramId === admin.telegramId) {
      await ctx.reply('Добро пожаловать, администратор!\nВы можете отправить /drivers, /status или /help.');
      return;
    }

    await ctx.reply('Здравствуйте! Этот бот предназначен для водителей TaxiPark Pro. Пожалуйста, свяжитесь с администратором.');
  });

  bot.command('help', async ctx => {
    await ctx.reply('Команды:\n/balance - ваш баланс\n/profile - данные водителя\n/withdraw <сумма> - запрос на выплату\n/drivers - список водителей (админ)\n/status - состояние системы');
  });

  bot.command('balance', async ctx => {
    const telegramId = ctx.from?.id;
    const driver = telegramId ? findDriverByTelegramId(telegramId) : undefined;
    if (!driver) {
      await ctx.reply('Баланс доступен только зарегистрированным водителям.');
      return;
    }
    await ctx.reply(`Ваш текущий баланс: ${driver.balance.toLocaleString('ru-RU')} сум`);
  });

  bot.command('profile', async ctx => {
    const telegramId = ctx.from?.id;
    const driver = telegramId ? findDriverByTelegramId(telegramId) : undefined;
    if (!driver) {
      await ctx.reply('Профиль доступен только зарегистрированным водителям.');
      return;
    }
    await ctx.reply(
      `Водитель: ${driver.fullName}\nТелефон: ${driver.phone}\nАвто: ${driver.carModel} (${driver.carNumber})\nПлатежная система: ${driver.paymentMethod === 'click' ? 'Click' : 'Payme'}\nБаланс: ${driver.balance.toLocaleString('ru-RU')} сум`
    );
  });

  bot.command('withdraw', async ctx => {
    const telegramId = ctx.from?.id;
    const driver = telegramId ? findDriverByTelegramId(telegramId) : undefined;
    if (!driver) {
      await ctx.reply('Запрос на вывод доступен только водителям.');
      return;
    }

    const text = ctx.message.text || '';
    const parts = text.split(' ').filter(Boolean);
    const amount = parts.length > 1 ? Number(parts[1]) : NaN;

    if (!amount || amount <= 0) {
      await ctx.reply('Пожалуйста, отправьте сумму в виде /withdraw 500000');
      return;
    }

    if (amount > driver.balance) {
      await ctx.reply('На балансе недостаточно средств для этой выплаты.');
      return;
    }

    await ctx.reply(`Ваш запрос на вывод ${amount.toLocaleString('ru-RU')} сум принят. Администратор обработает его в ближайшее время.`);
  });

  bot.command('drivers', async ctx => {
    const telegramId = ctx.from?.id;
    if (telegramId !== admin.telegramId) {
      await ctx.reply('Команда доступна только администратору.');
      return;
    }
    const list = drivers.map(driver => `• ${driver.fullName} — ${driver.balance.toLocaleString('ru-RU')} сум (${driver.status})`).join('\n');
    await ctx.reply(`Водители:\n${list}`);
  });

  bot.command('status', async ctx => {
    await ctx.reply('Сервер TaxiPark Pro работает.');
  });

  bot.launch().then(() => {
    console.log('Telegram bot initialized');
  }).catch(err => {
    console.error('Telegram bot failed to launch:', err);
  });
}
