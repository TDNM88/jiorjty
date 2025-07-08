"use client"

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useTheme } from 'next-themes';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ModernChartProps {
  data: CandleData[];
  selectedAsset: string;
  height?: number;
  showVolume?: boolean;
}

export function ModernChart({ 
  data, 
  selectedAsset, 
  height = 500, 
  showVolume = true 
}: ModernChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const { theme } = useTheme();

  // Initialize chart
  useEffect(() => {
    // Skip if container ref is not available
    if (!chartContainerRef.current) return;

    // Skip if we already have a chart instance
    if (chartRef.current) return;

    // Create the chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: theme === 'dark' ? '#D9D9D9' : '#191919',
        fontFamily: 'Inter, sans-serif',
      },
      width: chartContainerRef.current.clientWidth,
      height: showVolume ? height * 0.7 : height,
      grid: {
        vertLines: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
        horzLines: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.2,
          bottom: showVolume ? 0.2 : 0.05,
        },
        borderVisible: false,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      },
      crosshair: {
        mode: 0, // Normal crosshair mode
        vertLine: {
          width: 1,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          style: 1, // Dashed line
        },
        horzLine: {
          width: 1,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          style: 1, // Dashed line
        },
      },
    });

    // Create candlestick series with error handling
    let candleSeries: ISeriesApi<"Candlestick">;
    try {
      candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    } catch (error) {
      console.error('Failed to create candlestick series:', error);
      chart.remove();
      return;
    }

    // Create volume series if enabled
    let volumeSeries: ISeriesApi<"Histogram"> | null = null;
    if (showVolume) {
      try {
        volumeSeries = chart.addHistogramSeries({
        color: theme === 'dark' ? 'rgba(120, 120, 120, 0.5)' : 'rgba(120, 120, 120, 0.2)',
        priceFormat: { type: 'volume' },
        priceScaleId: '', // set as an overlay
      });
      
        if (volumeSeries) {
          const priceScale = (volumeSeries as any).priceScale();
          if (priceScale) {
            priceScale.applyOptions({
              scaleMargins: {
                top: 0.8, // highest point of the volume will be below 80% of the chart
                bottom: 0,
              },
            });
          }
        }
      } catch (error) {
        console.error('Failed to create volume series:', error);
        // Don't fail the whole chart if volume fails
      }
    }

    // Store references
    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Initial data set
    if (data.length > 0) {
      const formattedData = data.map(item => ({
        time: (item.time / 1000) as UTCTimestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      
      candleSeries.setData(formattedData);
      
      if (showVolume && volumeSeries) {
        const volumeData = data.map(item => ({
          time: (item.time / 1000) as UTCTimestamp,
          value: item.volume || 0,
        }));
        volumeSeries.setData(volumeData);
      }
      
      chart.timeScale().fitContent();
    }

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: showVolume ? height * 0.7 : height,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.current);

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [theme, height, showVolume]);

  // Update chart data when data changes
  useEffect(() => {
    if (!candleSeriesRef.current || !data.length) return;
    
    try {
      const formattedData = data.map(item => ({
        time: (item.time / 1000) as UTCTimestamp, // Convert to Unix timestamp (seconds)
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));

      candleSeriesRef.current.setData(formattedData);

      if (showVolume && volumeSeriesRef.current) {
        const volumeData = data.map(item => ({
          time: (item.time / 1000) as UTCTimestamp, // Convert to Unix timestamp (seconds)
          value: item.volume || 0,
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      // Auto-scale the chart to fit the data
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }, [data, showVolume]);

  return (
    <div 
      ref={chartContainerRef}
      style={{ width: '100%', height: `${height}px` }}
    />
  );
}
