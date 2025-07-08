// Type definitions for TradingView Widget

declare global {
  interface Window {
    TradingView: {
      widget: (options: TradingViewWidgetOptions) => void;
    };
  }
}

export interface TradingViewWidgetOptions {
  autosize?: boolean;
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: number;
  locale?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id: string;
  hide_top_toolbar?: boolean;
  hide_side_toolbar?: boolean;
  hide_volume?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  withdateranges?: boolean;
  disabled_features?: string[];
  enabled_features?: string[];
  onLoad?: () => void;
}
