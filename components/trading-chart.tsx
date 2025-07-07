"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Brush,
  Scatter
} from "recharts"
import { format } from "date-fns"

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface TradingChartProps {
  data: CandleData[]
  selectedAsset: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const date = new Date(data.time)
    const isUp = data.close >= data.open
    
    return (
      <div className="bg-slate-800 p-4 border border-slate-700 rounded-lg shadow-lg">
        <div className="text-sm text-slate-300">
          {format(date, 'HH:mm:ss')} • {format(date, 'MMM dd, yyyy')}
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Mở cửa:</span>
            <span className="font-mono">{data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cao nhất:</span>
            <span className="font-mono">{data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Thấp nhất:</span>
            <span className="font-mono">{data.low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Đóng cửa:</span>
            <span className={`font-mono ${isUp ? 'text-green-400' : 'text-red-400'}`}>
              {data.close.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Khối lượng:</span>
            <span className="font-mono">{data.volume.toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function TradingChart({ data, selectedAsset }: TradingChartProps) {
  const { t } = useLanguage()
  const [timeframe, setTimeframe] = useState("15m")
  const [showVolume, setShowVolume] = useState(true)

  // Format data for Recharts candlestick
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      name: new Date(item.time).toLocaleTimeString(),
    }))
  }, [data])

  // Calculate min and max for Y axis
  const minPrice = useMemo(() => {
    return Math.min(...data.map(item => item.low)) * 0.999
  }, [data])

  const maxPrice = useMemo(() => {
    return Math.max(...data.map(item => item.high)) * 1.001
  }, [data])

  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1d"]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={`${timeframe === tf 
                ? 'bg-purple-600 hover:bg-purple-700 border-purple-600' 
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
            >
              {tf}
            </Button>
          ))}
        </div>
        <Button
          variant={showVolume ? "default" : "outline"}
          size="sm"
          onClick={() => setShowVolume(!showVolume)}
          className={`${showVolume 
            ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' 
            : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
        >
          {showVolume ? 'Ẩn khối lượng' : 'Hiện khối lượng'}
        </Button>
      </div>

      <div className="w-full h-[400px] bg-slate-700/30 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              minTickGap={50}
              axisLine={false}
            />
            
            <YAxis 
              yAxisId="left"
              domain={[minPrice, maxPrice]} 
              orientation="right" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
              width={80}
            />
            
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                width={0}
                hide={true}
              />
            )}
            
            <Tooltip 
              content={<CustomTooltip />}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '0.5rem',
              }}
            />
            
            <Legend />
            
            {/* Candlestick Chart */}
            {chartData.map((d, i) => {
              const isUp = d.close >= d.open;
              const color = isUp ? '#10b981' : '#ef4444';
              const candleWidth = 8;
              const bodyHeight = Math.max(1, Math.abs(d.close - d.open));
              const bodyY = isUp ? d.close - bodyHeight : d.close;
              
              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={i * 10}
                    y1={d.high}
                    x2={i * 10}
                    y2={d.low}
                    stroke={color}
                    strokeWidth={1}
                  />
                  {/* Candle body */}
                  <rect
                    x={i * 10 - candleWidth / 2}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke="none"
                  />
                </g>
              );
            })}
            
            {/* Volume Bars */}
            {showVolume && (
              <Bar 
                dataKey="volume" 
                fill="#3b82f6" 
                yAxisId="volume"
                name={t('chart.volume')}
                opacity={0.6}
              />
            )}
            
            <Brush
              dataKey="time"
              height={20}
              stroke="#4b5563"
              fill="#1f2937"
              travellerWidth={8}
              tickFormatter={(value) => {
                try {
                  const date = new Date(Number(value))
                  return isNaN(date.getTime()) ? '' : format(date, 'HH:mm')
                } catch (e) {
                  return ''
                }
              }}
            />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
