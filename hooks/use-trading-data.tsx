"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useCandleData } from "./use-candle-data";
import { useCandlesUpdate } from "./use-candles-update";

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function useTradingData(selectedAsset = "BTC") {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const initialPriceRef = useRef(0);

  // Use candle data hook
  const { candles, generateCandle, initialPrice } = useCandleData(selectedAsset);

  // Save initial price to ref
  useEffect(() => {
    if (initialPrice > 0) {
      initialPriceRef.current = initialPrice;
      setCurrentPrice(initialPrice);
    }
  }, [initialPrice]);

  // Handle new candle
  const handleNewCandle = useCallback((candle: CandleData) => {
    setChartData(prev => {
      const newData = [...prev, candle];
      // Keep max 100 candles
      return newData.slice(-100);
    });
    
    setCurrentPrice(candle.close);
    
    setPriceChange(prev => {
      const initial = initialPriceRef.current;
      return ((candle.close - initial) / initial) * 100;
    });
  }, []);

  // Real-time updates
  const { currentCandle } = useCandlesUpdate({
    candles,
    generateCandle,
    onNewCandle: handleNewCandle,
    interval: 1000 // Update every second
  });

  // Update current price from the forming candle
  useEffect(() => {
    if (currentCandle) {
      setCurrentPrice(currentCandle.close);
    }
  }, [currentCandle]);

  // Combine historical and current candle data
  const combinedData = useMemo(() => {
    return [...chartData, ...(currentCandle ? [currentCandle] : [])];
  }, [chartData, currentCandle]);

  return { 
    currentPrice, 
    priceChange, 
    chartData: combinedData,
    isLoading: combinedData.length === 0
  };
}
