'use client';

import { useEffect, useRef } from 'react';

export function GoldPriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && containerRef.current) {
      // Remove any existing iframe to prevent duplicates
      containerRef.current.innerHTML = '';
      
      // Create iframe element
      const iframe = document.createElement('iframe');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('title', 'Gold Price Chart');
      iframe.style.cssText = 'user-select: none; box-sizing: border-box; display: block; height: 100%; width: 100%;';
      
      // Set the source with your widget configuration
      iframe.src = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#%7B%22autosize%22%3Atrue%2C%22theme%22%3A%22dark%22%2C%22interval%22%3A%221%22%2C%22symbol%22%3A%22TVC%3AGOLD%22%2C%22timezone%22%3A%22Etc%2FUTC%22%2C%22allow_symbol_change%22%3Afalse%2C%22hide_side_toolbar%22%3Atrue%2C%22hide_volume%22%3Afalse%2C%22hide_legend%22%3Afalse%2C%22disabled_features%22%3A%5B%22header_widget%22%2C%22header_symbol_search%22%2C%22header_compare%22%2C%22header_indicators%22%2C%22header_settings%22%2C%22header_fullscreen_button%22%2C%22header_chart_type%22%2C%22header_interval_dialog_button%22%2C%22header_undo_redo%22%2C%22header_screenshot%22%2C%22timeframes_toolbar%22%2C%22left_toolbar%22%2C%22edit_buttons_in_legend%22%2C%22use_localstorage_for_settings%22%2C%22chart_zoom%22%2C%22chart_pan%22%2C%22mousewheel_zoom%22%5D%2C%22style%22%3A1%2C%22withdateranges%22%3Afalse%2C%22hide_top_toolbar%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22`;
      
      // Append the iframe to the container
      containerRef.current.appendChild(iframe);
      
      // Cleanup function
      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }
  }, []);

  return (
    <div className="h-full w-full p-0">
      <div 
        ref={containerRef} 
        className="relative tradingview-widget-container w-full" 
        style={{ height: '100%', width: '100%' }}
      >
        <style jsx>{`
          .tradingview-widget-copyright {
            font-size: 13px !important;
            line-height: 32px !important;
            text-align: center !important;
            vertical-align: middle !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
            color: #B2B5BE !important;
          }
          .tradingview-widget-copyright .blue-text {
            color: #2962FF !important;
          }
          .tradingview-widget-copyright a {
            text-decoration: none !important;
            color: #B2B5BE !important;
          }
          .tradingview-widget-copyright a:visited {
            color: #B2B5BE !important;
          }
          .tradingview-widget-copyright a:hover .blue-text {
            color: #1E53E5 !important;
          }
          .tradingview-widget-copyright a:active .blue-text {
            color: #1848CC !important;
          }
          .tradingview-widget-copyright a:visited .blue-text {
            color: #2962FF !important;
          }
        `}</style>
      </div>
    </div>
  );
}
