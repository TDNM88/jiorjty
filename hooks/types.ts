export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// A function that generates a new candle based on the previous candle or price
export type GenerateCandleFn = {
  (lastCandle: CandleData, timestamp?: number): CandleData;
  (lastCandle: number, timestamp?: number): CandleData;
};
