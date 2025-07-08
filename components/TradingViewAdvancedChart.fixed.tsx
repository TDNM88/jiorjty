"use client"

import { useEffect, useRef, useCallback } from "react"

// Type declarations for TradingView widget
declare global {
  interface Window {
    TradingView?: {
      widget: (options: TradingViewWidgetOptions) => void;
    };
  }
}

interface TradingViewWidgetOptions {
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

interface TradingViewAdvancedChartProps {
  symbol?: string;
  interval?: string;
  theme?: "light" | "dark";
  height?: number | string;
  interactive?: boolean;
  style?: number;
  hideTopBar?: boolean;
  hideSideToolbar?: boolean;
  hideVolume?: boolean;
  hideLegend?: boolean;
  withDateRanges?: boolean;
  saveImage?: boolean;
  containerId?: string;
  locale?: string;
  timezone?: string;
  allowSymbolChange?: boolean;
  enablePublishing?: boolean;
  disabledFeatures?: string[];
  enabledFeatures?: string[];
  autosize?: boolean;
  onLoad?: () => void;
}

export default function TradingViewAdvancedChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "15",
  theme = "dark",
  height = "100%",
  style = 1,
  interactive = true,
  hideTopBar = false,
  hideSideToolbar = false,
  hideVolume = false,
  hideLegend = false,
  withDateRanges = false,
  saveImage = true,
  containerId = "tradingview-widget-container",
  locale = "en",
  timezone = "Etc/UTC",
  allowSymbolChange = false,
  enablePublishing = false,
  disabledFeatures = [],
  enabledFeatures = [],
  autosize = true,
  onLoad,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetId = `tradingview-widget-${Math.random().toString(36).substr(2, 9)}`;

  const defaultDisabledFeatures = useCallback(() => {
    if (!interactive) {
      return [
        "header_widget",
        "header_symbol_search",
        "header_compare",
        "header_indicators",
        "header_settings",
        "header_fullscreen_button",
        "header_chart_type",
        "header_interval_dialog_button",
        "header_undo_redo",
        "header_screenshot",
        "timeframes_toolbar",
        "left_toolbar",
        "edit_buttons_in_legend",
        "use_localstorage_for_settings",
        "chart_zoom",
        "chart_pan",
        "mousewheel_zoom",
      ];
    }
    return [];
  }, [interactive]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    containerRef.current.innerHTML = `
      <div id="${widgetId}" class="tradingview-widget-container__widget" style="height: 100%; width: 100%;"></div>
    `;

    // Create script element
    const script = document.createElement("script");
    scriptRef.current = script;
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        // Fixed: Remove 'new' keyword as widget is a function, not a constructor
        window.TradingView.widget({
          autosize,
          symbol,
          interval,
          timezone,
          theme,
          style,
          locale,
          enable_publishing: enablePublishing,
          allow_symbol_change: allowSymbolChange,
          container_id: widgetId,
          hide_top_toolbar: hideTopBar,
          hide_side_toolbar: hideSideToolbar,
          hide_volume: hideVolume,
          hide_legend: hideLegend,
          save_image: saveImage,
          withdateranges: withDateRanges,
          disabled_features: [...defaultDisabledFeatures(), ...disabledFeatures],
          enabled_features: enabledFeatures,
          ...(onLoad && { onLoad }),
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Remove script
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
      // Clean up TradingView widget
      if (window.TradingView) {  // Fixed: Removed redundant check for window.TradingView.widget
        const widget = document.getElementById(widgetId);
        if (widget) {
          widget.innerHTML = '';
        }
      }
    };
  }, [
    symbol,
    interval,
    theme,
    style,
    interactive,
    hideTopBar,
    hideSideToolbar,
    hideVolume,
    hideLegend,
    withDateRanges,
    saveImage,
    containerId,
    locale,
    timezone,
    allowSymbolChange,
    enablePublishing,
    disabledFeatures,
    enabledFeatures,
    autosize,
    widgetId,
    defaultDisabledFeatures,
    onLoad,
  ]);

  return (
    <div 
      className="tradingview-widget-container w-full" 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        position: 'relative',
      }} 
      ref={containerRef}
    >
      {!interactive && (
        <div
          className="absolute inset-0 z-10 select-none touch-none"
          style={{ 
            pointerEvents: 'auto',
            height: '100%',
            width: '100%',
          }}
          onWheelCapture={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          onMouseDown={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
}
