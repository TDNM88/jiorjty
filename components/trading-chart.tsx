"use client"

import { useMemo } from "react"
import { ModernChart } from "./modern-chart"

export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

interface TradingChartProps {
  data: CandleData[]
  selectedAsset: string
}

export function TradingChart({ data, selectedAsset }: TradingChartProps) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      time: new Date(d.time).getTime(),
    }))
  }, [data])

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <ModernChart 
        data={chartData} 
        selectedAsset={selectedAsset} 
        height={500}
        showVolume={true}
      />
    </div>
  )
}
