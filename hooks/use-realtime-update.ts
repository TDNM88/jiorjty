import { useEffect, useRef } from "react";

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type GenerateCandleFn = (prevClose: number, timestamp: number) => CandleData;
type NewCandleCallback = (candle: CandleData) => void;

export function useRealtimeUpdate(
  candles: CandleData[], 
  generateCandle: GenerateCandleFn, 
  onNewCandle: NewCandleCallback
) {
  const currentCandleRef = useRef<CandleData | null>(null);
  const lastUpdateRef = useRef(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (candles.length === 0) return;

    // Khởi tạo nến hiện tại
    if (!currentCandleRef.current) {
      const lastCandle = candles[candles.length - 1];
      currentCandleRef.current = { ...lastCandle };
    }

    const update = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      if (!currentCandleRef.current) return;

      // Cập nhật giá hiện tại
      const currentCandle = currentCandleRef.current;
      const change = (Math.random() - 0.5) * 0.01 * (deltaTime / 1000);
      const newPrice = currentCandle.close * (1 + change);
      
      // Cập nhật nến hiện tại
      currentCandle.high = Math.max(currentCandle.high, newPrice);
      currentCandle.low = Math.min(currentCandle.low, newPrice);
      currentCandle.close = newPrice;
      currentCandle.volume += Math.random() * 2 * (deltaTime / 1000);

      // Kiểm tra nếu đã qua 1 phút
      if (now - currentCandle.time >= 60000) {
        // Tạo nến mới
        const newCandle = generateCandle(
          currentCandle.close, // prevClose
          now                 // timestamp
        );
        
        // Đặt lại giá trị high/low cho nến mới
        newCandle.open = currentCandle.close;
        newCandle.high = currentCandle.close;
        newCandle.low = currentCandle.close;
        newCandle.volume = 0;
        
        // Gọi callback với nến cũ
        onNewCandle({ ...currentCandle });
        
        // Cập nhật nến hiện tại
        currentCandleRef.current = newCandle;
      }

      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    animationFrameRef.current = requestAnimationFrame(update);
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [candles, generateCandle, onNewCandle]);

  return { currentCandle: currentCandleRef.current };
}
