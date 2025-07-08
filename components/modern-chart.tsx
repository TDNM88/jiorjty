"use client"

import React, { useEffect, useRef, useCallback } from 'react';
import { 
  createChart, 
  ColorType, 
  IChartApi, 
  ISeriesApi, 
  UTCTimestamp,
  CandlestickData,
  HistogramData
} from 'lightweight-charts';
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

  // Format data for the chart
  const formatChartData = useCallback((data: CandleData[]): CandlestickData[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data
      .filter(item => item && typeof item.time === 'number' && !isNaN(item.time))
      .map(item => ({
        time: (item.time / 1000) as UTCTimestamp,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
      }));
  }, []);

  // Format volume data
  const formatVolumeData = useCallback((data: CandleData[]): HistogramData[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data
      .filter(item => item && typeof item.time === 'number' && !isNaN(item.time))
      .map(item => ({
        time: (item.time / 1000) as UTCTimestamp,
        value: item.volume || 0,
      }));
  }, []);

  // Initialize chart
  useEffect(() => {
    console.log('Initializing chart with data:', data);
    
    // Skip if container ref is not available
    if (!chartContainerRef.current) {
      console.error('Chart container ref is not available');
      return;
    }

    // Skip if we already have a chart instance
    if (chartRef.current) {
      console.log('Chart instance already exists, skipping initialization');
      return;
    }

    try {
      console.log('Creating new chart instance');
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
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
          mode: 0,
          vertLine: {
            width: 1,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            style: 1,
          },
          horzLine: {
            width: 1,
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            style: 1,
          },
        },
      });

      // Create candlestick series with type assertion
      console.log('Adding candlestick series');
      const candleSeries = (chart as any).addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Create volume series if enabled
      let volumeSeries: ISeriesApi<"Histogram"> | null = null;
      if (showVolume) {
        try {
          console.log('Adding volume series');
          // Use type assertion for addHistogramSeries
          volumeSeries = (chart as any).addHistogramSeries({
            color: theme === 'dark' ? 'rgba(120, 120, 120, 0.5)' : 'rgba(120, 120, 120, 0.2)',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
          });
          
          if (volumeSeries) {
            const priceScale = (volumeSeries as any).priceScale();
            if (priceScale) {
              priceScale.applyOptions({
                scaleMargins: {
                  top: 0.8,
                  bottom: 0,
                },
              });
            }
          }
        } catch (error) {
          console.error('Failed to create volume series:', error);
        }
      }

      // Store references
      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;

      // Set initial data if available
      if (data && data.length > 0) {
        try {
          console.log('Setting initial chart data');
          const formattedData = formatChartData(data);
          console.log('Formatted chart data:', formattedData);
          
          if (formattedData.length > 0) {
            candleSeries.setData(formattedData);
            
            if (showVolume && volumeSeries) {
              const volumeData = formatVolumeData(data);
              if (volumeData.length > 0) {
                volumeSeries.setData(volumeData);
              }
            }
            
            chart.timeScale().fitContent();
          } else {
            console.warn('No valid data to display in chart');
          }
        } catch (error) {
          console.error('Error setting initial chart data:', error);
        }
      } else {
        console.warn('No data available for chart initialization');
      }

      // Handle window resize
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          try {
            chartRef.current.applyOptions({
              width: chartContainerRef.current.clientWidth,
              height: showVolume ? height * 0.7 : height,
            });
          } catch (error) {
            console.error('Error resizing chart:', error);
          }
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(chartContainerRef.current);

      // Cleanup
      return () => {
        try {
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
        } catch (error) {
          console.error('Error during chart cleanup:', error);
        }
      };
    } catch (error) {
      console.error('Failed to initialize chart:', error);
    }
  }, [theme, height, showVolume, formatChartData, formatVolumeData, data]);

  // Update chart data when data changes
  useEffect(() => {
    console.log('Chart data updated:', data);
    
    if (!candleSeriesRef.current) {
      console.warn('Candle series not available');
      return;
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No data available for chart update');
      return;
    }
    
    try {
      const formattedData = formatChartData(data);
      console.log('Updating chart with data:', formattedData);
      
      if (formattedData.length > 0) {
        candleSeriesRef.current.setData(formattedData);

        if (showVolume && volumeSeriesRef.current) {
          const volumeData = formatVolumeData(data);
          if (volumeData.length > 0) {
            volumeSeriesRef.current.setData(volumeData);
          }
        }

        // Auto-scale the chart to fit the data
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
      } else {
        console.warn('No valid data to update chart');
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }, [data, showVolume, formatChartData, formatVolumeData]);

  return (
    <div 
      ref={chartContainerRef}
      style={{ 
        width: '100%', 
        height: `${height}px`,
        minHeight: '300px',
        position: 'relative'
      }}
    >
      {(!data || data.length === 0) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: theme === 'dark' ? '#fff' : '#000',
          textAlign: 'center',
          padding: '20px',
          backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
          borderRadius: '8px'
        }}>
          Loading chart data...
        </div>
      )}
    </div>
  );
}
