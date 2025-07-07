import { useState, useCallback, useEffect, useRef } from "react";
import { getAssetBySymbol } from "@/lib/assets-data";

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function useCandleData(selectedAsset = "BTC") {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const assetRef = useRef<any>(null);
  const initialPriceRef = useRef(0);

  // Tạo nến mới
  const generateCandle = useCallback((prevClose: number, timestamp: number): CandleData => {
    const asset = assetRef.current;
    const change = (Math.random() - 0.5) * (asset?.volatility || 1) * 0.01;
    const close = Math.max(prevClose * (1 + change), (asset?.basePrice || 100) * 0.8);
    
    return {
      time: timestamp,
      open: prevClose,
      high: Math.max(prevClose, close) * (1 + Math.random() * 0.01),
      low: Math.min(prevClose, close) * (1 - Math.random() * 0.01),
      close,
      volume: Math.random() * 10 + 5
    };
  }, []);

  // Khởi tạo dữ liệu ban đầu
  useEffect(() => {
    const asset = getAssetBySymbol(selectedAsset);
    if (!asset) return;

    assetRef.current = asset;
    initialPriceRef.current = asset.basePrice;
    
    // Tạo 100 nến ban đầu
    const initialCandles: CandleData[] = [];
    let lastClose = asset.basePrice;
    
    for (let i = 0; i < 100; i++) {
      const candle = generateCandle(lastClose, Date.now() - (100 - i) * 60000);
      initialCandles.push(candle);
      lastClose = candle.close;
    }
    
    setCandles(initialCandles);
  }, [selectedAsset, generateCandle]);

  return { 
    candles, 
    generateCandle,
    initialPrice: initialPriceRef.current
  };
}
