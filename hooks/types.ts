export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// A function that generates a new candle based on the previous candle's close price or a number
export type GenerateCandleFn = (lastCandle: CandleData | number, timestamp?: number) => CandleData;
