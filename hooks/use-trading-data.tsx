"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useCandleData } from "./use-candle-data";
import { useRealtimeUpdate } from "./use-realtime-update";

interface CandleData {
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

  // Sử dụng hook quản lý dữ liệu nến
  const { candles, generateCandle, initialPrice } = useCandleData(selectedAsset);

  // Lưu giá ban đầu vào ref
  useEffect(() => {
    if (initialPrice > 0) {
      initialPriceRef.current = initialPrice;
    }
  }, [initialPrice]);

  // Xử lý khi có nến mới
  const handleNewCandle = useCallback((candle: CandleData) => {
    setChartData(prev => {
      const newData = [...prev, candle];
      // Giữ tối đa 100 nến
      return newData.slice(-100);
    });
    
    setCurrentPrice(candle.close);
    
    setPriceChange(prev => {
      const initial = initialPriceRef.current;
      return ((candle.close - initial) / initial) * 100;
    });
  }, []);

  // Cập nhật thời gian thực
  const { currentCandle } = useRealtimeUpdate(
    candles,
    generateCandle,
    handleNewCandle
  );

  // Cập nhật giá hiện tại từ nến đang hình thành
  useEffect(() => {
    if (currentCandle) {
      setCurrentPrice(currentCandle.close);
    }
  }, [currentCandle]);

  // Kết hợp dữ liệu nến cũ và nến đang hình thành
  const combinedData = useMemo(() => {
    return [...chartData, ...(currentCandle ? [currentCandle] : [])];
  }, [chartData, currentCandle]);

  return { 
    currentPrice, 
    priceChange, 
    chartData: combinedData 
  };
}
