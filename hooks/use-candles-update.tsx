"use client"

import { useState, useEffect, useCallback } from 'react';
import type { CandleData, GenerateCandleFn } from './types';
type NewCandleHandler = (candle: CandleData) => void;

// Type for the generateCandle function that takes a number (close price) and returns a CandleData
type NumberGenerateCandleFn = (prevClose: number, timestamp: number) => CandleData;

export interface UseCandlesUpdateProps {
  candles: CandleData[];
  generateCandle: NumberGenerateCandleFn;
  onNewCandle: NewCandleHandler;
  interval?: number;
}

export const useCandlesUpdate = ({
  candles,
  generateCandle,
  onNewCandle,
  interval = 1000
}: UseCandlesUpdateProps) => {
  const [currentCandle, setCurrentCandle] = useState<CandleData | null>(null);
  
  // Safely get the last candle, if available
  const lastCandle = candles && candles.length > 0 ? candles[candles.length - 1] : null;

  useEffect(() => {
    // Only proceed if we have candles and at least one candle
    if (!candles || !candles.length || !lastCandle) return;

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
      } else if (currentCandle) {
        try {
          // Update the current candle
          const newCandle = generateCandle(currentCandle.close, Date.now());
          setCurrentCandle({
            ...currentCandle,
            close: newCandle.close,
            high: Math.max(currentCandle.high, newCandle.close),
            low: Math.min(currentCandle.low, newCandle.close),
            volume: currentCandle.volume + (newCandle.volume || 0)
          });
        } catch (error) {
          console.error('Error generating candle:', error);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentCandle, generateCandle, onNewCandle, interval]);

  return { currentCandle };
}
