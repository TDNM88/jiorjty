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

export function useCandleData(selectedAsset: string) {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [initialPrice, setInitialPrice] = useState(0);

  // Generate mock candle data
  const generateCandle = useCallback((lastCandle?: CandleData): CandleData => {
    const basePrice = lastCandle?.close || 50000 + Math.random() * 10000;
    const volatility = 0.01 + Math.random() * 0.02;
    const changePercent = (Math.random() * 2 - 1) * volatility;
    const newPrice = basePrice * (1 + changePercent);
    const open = lastCandle?.close || newPrice;
    const close = newPrice;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = 100 + Math.random() * 1000;

    return {
      time: Date.now(),
      open,
      high,
      low,
      close,
      volume
    };
  }, []);

  // Initialize candles
  useEffect(() => {
    // Generate initial candles
    const initialCandles: CandleData[] = [];
    const now = Date.now();
    
    for (let i = 10; i > 0; i--) {
      const candle = generateCandle(initialCandles[initialCandles.length - 1]);
      candle.time = now - i * 60000; // 1 minute apart
      initialCandles.push(candle);
    }
    
    setCandles(initialCandles);
    setInitialPrice(initialCandles[0]?.close || 50000);
  }, [generateCandle, selectedAsset]);

  return { candles, generateCandle, initialPrice };
}
