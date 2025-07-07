"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from "react"

// Import translations
import enTranslations from '@/locales/en.json';
import viTranslations from '@/locales/vi.json';

const translations = {
  en: {
    ...enTranslations,
    // Giữ lại các key cũ để tương thích ngược
    trade: "Trade",
    markets: "Markets",
    portfolio: "Portfolio",
    exchange: "Exchange",
    connect_wallet: "Connect Wallet",
    connected: "Connected",
    logout: "Logout",
    place_trade: "Place Trade",
    buy_up: "Buy (Up)",
    sell_down: "Sell (Down)",
    trading_pair: "Trading Pair",
    amount: "Amount",
    duration: "Duration",
    potential_payout: "Potential Payout",
    place_buy_order: "Place Buy Order",
    place_sell_order: "Place Sell Order",
    up_to_payout: "Up to 85% Payout",
    wallet: "Wallet",
    total_balance: "Total Balance",
    todays_pnl: "Today's P&L",
    win_rate: "Win Rate",
    deposit: "Deposit",
    withdraw: "Withdraw",
    connect_now: "Connect Now",
    connect_wallet_to_start: "Connect your wallet to start trading",
    trade_history: "Trade History",
    all: "All",
    pending: "Pending",
    completed: "Completed",
  },
  vi: {
    ...viTranslations,
    // Giữ lại các key cũ để tương thích ngược
    trade: "Giao Dịch",
    markets: "Thị Trường",
    portfolio: "Danh Mục",
    exchange: "Đổi Tiền",
    connect_wallet: "Kết Nối Ví",
    connected: "Đã Kết Nối",
    logout: "Đăng Xuất",
    place_trade: "Đặt Lệnh",
    buy_up: "Mua (Lên)",
    sell_down: "Bán (Xuống)",
    trading_pair: "Cặp Giao Dịch",
    amount: "Số Lượng",
    duration: "Thời Gian",
    potential_payout: "Lợi Nhuận Tiềm Năng",
    place_buy_order: "Đặt Lệnh Mua",
    place_sell_order: "Đặt Lệnh Bán",
    up_to_payout: "Lợi Nhuận Lên Đến 85%",
    wallet: "Ví",
    total_balance: "Tổng Số Dư",
    todays_pnl: "Lời/Lỗ Hôm Nay",
    win_rate: "Tỷ Lệ Thắng",
    deposit: "Nạp Tiền",
    withdraw: "Rút Tiền",
    connect_now: "Kết Nối Ngay",
    connect_wallet_to_start: "Kết nối ví để bắt đầu giao dịch",
    trade_history: "Lịch Sử Giao Dịch",
    all: "Tất Cả",
    pending: "Đang Chờ",
    completed: "Hoàn Tất",
  }
} as const;

type Language = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultLanguage: Language = 'en';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (translations[browserLanguage]) {
        setLanguage(browserLanguage);
      }
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }
    
    return value || key;
  };

  const contextValue = useMemo(() => ({
    language,
    setLanguage: (lang: Language) => {
      localStorage.setItem('language', lang);
      setLanguage(lang);
    },
    t
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
