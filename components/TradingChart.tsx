"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";
import axios from "axios";
import "./TradingChart.css";

declare module 'lightweight-charts' {
  interface IChartApi {
    addAreaSeries(options?: any): ISeriesApi<'Area'>;
  }
}

interface LatestPrices {
  SOL_USD?: { price: number; timestamp: number };
  ETH_USD?: { price: number; timestamp: number };
  BTC_USD?: { price: number; timestamp: number };
  [key: string]: { price: number; timestamp: number } | undefined;
}

interface TradingChartProps {
  latestPrices: LatestPrices;
  selectedNetwork: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ latestPrices, selectedNetwork }) => {
  // Networks
  const networks = [
    { name: "SOL/USD", symbol: "SOL" },
    { name: "ETH/USD", symbol: "ETH" },
    { name: "BTC/USD", symbol: "BTC" },
  ];

  const latestPrice = latestPrices[
    selectedNetwork === 1 ? "SOL_USD" : 
    selectedNetwork === 2 ? "ETH_USD" : 
    "BTC_USD"
  ];

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("1HOUR");
  const [periodData, setPeriodData] = useState<Array<{ time: number; value: number }>>([]);
  
  // Cleanup function to remove chart
  const cleanupChart = useCallback(() => {
    if (chartRef.current) {
      try {
        const container = chartContainerRef.current;
        if (container) {
          container.innerHTML = ''; // Clear the container
        }
        chartRef.current.remove();
      } catch (e) {
        console.error('Error removing chart:', e);
      }
      chartRef.current = null;
      seriesRef.current = null;
    }
  }, []);

  const fetchPriceHistory = async () => {
    try {
      const res = await axios.get(
        `https://web-api.pyth.network/history?symbol=Crypto.${
          networks[selectedNetwork - 1].symbol
        }%2FUSD&range=1H&cluster=pythnet`
      );
      const allPrices = res.data || [];
      const timeDivide =
        selectedPeriod === "1HOUR" ? 1 :
        selectedPeriod === "30MINS" ? 2 :
        selectedPeriod === "15MINS" ? 4 : 6;
      
      const halfLength = Math.floor(allPrices.length / timeDivide);
      const slicedPrices = allPrices.slice(-halfLength);
      
      const formatted = slicedPrices.map((p: any) => ({
        time: Math.floor(Date.parse(p.timestamp + "Z") / 1000),
        value: p.close_price,
      }));

      setPeriodData(formatted);
    } catch (err) {
      console.error("Failed to fetch prices:", err);
    }
  };

  // Initialize chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Clean up any existing chart first
    cleanupChart();

    // Create new chart instance
    const chart: IChartApi = createChart(container, {
      width: container.clientWidth,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "white",
      },
      grid: {
        vertLines: { color: "#00000070" },
        horzLines: { color: "#00000070" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    chartRef.current = chart;

    const series = chart.addAreaSeries({
      topColor: "#5849fe",
      bottomColor: "#5849fe03",
      lineColor: "#5849fe",
      lineWidth: 1,
    });

    if (periodData.length > 0) {
      series.setData(periodData);
      chart.timeScale().fitContent();
    }
    
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== container) return;
      chart.applyOptions({ width: container.clientWidth });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      cleanupChart();
    };
  }, [cleanupChart]);

  // Update chart data when periodData changes
  useEffect(() => {
    if (seriesRef.current && chartRef.current && periodData.length > 0) {
      seriesRef.current.setData(periodData);
      chartRef.current.timeScale().fitContent();
    }
  }, [periodData]);

  // Fetch data when period or network changes
  useEffect(() => {
    fetchPriceHistory();
  }, [selectedPeriod, selectedNetwork]);

  // Update data interval
  useEffect(() => {
    const interval = setInterval(() => {
      setPeriodData((prev) => {
        if (prev.length <= 1) return prev;
        return prev.slice(1);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update data when latest price changes
  useEffect(() => {
    if (!latestPrice?.price || latestPrice?.timestamp === undefined || periodData.length === 0) {
      return;
    }

    const newPoint = {
      time: latestPrice.timestamp,
      value: latestPrice.price,
    };

    setPeriodData((prev) => {
      const existingIndex = prev.findIndex((p) => p.time === newPoint.time);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newPoint;
        return updated;
      } else {
        return [...prev, newPoint].sort((a, b) => a.time - b.time);
      }
    });
  }, [latestPrice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupChart();
    };
  }, [cleanupChart]);

  return (
    <div className="trading-chart-container">
      <div className="chart-controls">
        <div className="time-intervals">
          {["10MINS", "15MINS", "30MINS", "1HOUR"].map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedPeriod(interval)}
              className={`interval-btn ${
                selectedPeriod === interval ? "active" : ""
              }`}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default TradingChart;
