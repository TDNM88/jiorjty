"use client"

import { useState, useEffect, useCallback } from 'react';
import type { CandleData, GenerateCandleFn } from './types';

// Type for the generateCandle function that takes a number (close price) and returns a CandleData
type NumberGenerateCandleFn = (prevClose: number, timestamp: number) => CandleData;

export function useCandleData(selectedAsset: string) {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [initialPrice, setInitialPrice] = useState(0);

  // Generate mock candle data - implementation of GenerateCandleFn
  const generateCandle = useCallback<GenerateCandleFn>(
    (lastCandle: CandleData | number, timestamp?: number): CandleData => {
      const basePrice = typeof lastCandle === 'number' ? lastCandle : lastCandle.close;
      const volatility = 0.01 + Math.random() * 0.02;
      const changePercent = (Math.random() * 2 - 1) * volatility;
      const newPrice = basePrice * (1 + changePercent);
      const open = typeof lastCandle === 'number' ? lastCandle : lastCandle.close;
      const close = newPrice;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = 100 + Math.random() * 1000;

      return {
        time: timestamp || Date.now(),
        open,
        high,
        low,
        close,
        volume
      };
    },
    []
  );

  // Initialize candles
  useEffect(() => {
    // Generate initial candles
    const initialCandles: CandleData[] = [];
    const now = Date.now();
    
    // Create the first candle with a random price
    const firstCandle: CandleData = {
      time: now - 10 * 60000, // 10 minutes ago
      open: 50000 + Math.random() * 10000,
      high: 0,
      low: 0,
      close: 0,
      volume: 100 + Math.random() * 1000
    };
    firstCandle.close = firstCandle.open;
    firstCandle.high = firstCandle.open * (1 + Math.random() * 0.01);
    firstCandle.low = firstCandle.open * (1 - Math.random() * 0.01);
    initialCandles.push(firstCandle);
    
    // Generate the rest of the candles
    for (let i = 9; i > 0; i--) {
      const lastCandle = initialCandles[initialCandles.length - 1];
      const candle = generateCandle(lastCandle.close, now - i * 60000);
      initialCandles.push(candle);
    }
    
    setCandles(initialCandles);
    setInitialPrice(initialCandles[0]?.close || 50000);
  }, [generateCandle, selectedAsset]);

  // Cast generateCandle to the more specific type for consumers that expect it
  return { 
    candles, 
    generateCandle: generateCandle as unknown as NumberGenerateCandleFn, 
    initialPrice 
  };
}
