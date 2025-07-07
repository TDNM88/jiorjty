"use client"

import { useState, useEffect, useCallback } from 'react';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type GenerateCandleFn = (lastCandle?: CandleData) => CandleData;
type NewCandleHandler = (candle: CandleData) => void;

interface UseRealtimeUpdateProps {
  candles: CandleData[];
  generateCandle: GenerateCandleFn;
  onNewCandle: NewCandleHandler;
  interval?: number;
}

export function useRealtimeCandles(
  candles: CandleData[],
  generateCandle: GenerateCandleFn,
  onNewCandle: NewCandleHandler,
  interval: number = 1000
) {
  const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
  const lastCandle = candles[candles.length - 1];

  useEffect(() => {
    if (!lastCandle) return;

    // Initialize current candle with the last candle's close price
    if (!currentCandle) {
      setCurrentCandle({
        ...lastCandle,
        time: Date.now(),
        open: lastCandle.close,
        high: lastCandle.close,
        low: lastCandle.close,
        close: lastCandle.close,
        volume: 0
      });
    }
  }, [lastCandle, currentCandle]);

  useEffect(() => {
    if (!currentCandle) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const timeDiff = now - currentCandle.time;
      const isNewCandle = timeDiff >= 60000; // 1 minute candles

      if (isNewCandle) {
        // Finalize the current candle and start a new one
        onNewCandle(currentCandle);
        setCurrentCandle({
          time: now,
          open: currentCandle.close,
          high: currentCandle.close,
          low: currentCandle.close,
          close: currentCandle.close,
          volume: 0
        });
      } else {
        // Update the current candle
        const newCandle = generateCandle(currentCandle);
        setCurrentCandle({
          ...newCandle,
          time: currentCandle.time, // Keep the original time
          open: currentCandle.open, // Keep the original open
          high: Math.max(currentCandle.high, newCandle.close),
          low: Math.min(currentCandle.low, newCandle.close),
          volume: currentCandle.volume + newCandle.volume
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentCandle, generateCandle, onNewCandle, interval]);

  return { currentCandle };
}
