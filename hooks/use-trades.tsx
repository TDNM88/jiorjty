"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Trade {
  id: string
  asset: string
  type: "up" | "down"
  amount: number
  duration: string
  timestamp: Date
  status: "pending" | "completed" | "cancelled"
  payout: number
}

interface TradesContextType {
  trades: Trade[]
  addTrade: (trade: Trade) => void
}

const TradesContext = createContext<TradesContextType | undefined>(undefined)

export function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: "1",
      asset: "BTC",
      type: "up",
      amount: 100,
      duration: "5m",
      timestamp: new Date(Date.now() - 300000),
      status: "completed",
      payout: 185,
    },
    {
      id: "2",
      asset: "ETH",
      type: "down",
      amount: 50,
      duration: "1m",
      timestamp: new Date(Date.now() - 180000),
      status: "completed",
      payout: 92.5,
    },
    {
      id: "3",
      asset: "SOL",
      type: "up",
      amount: 75,
      duration: "15m",
      timestamp: new Date(Date.now() - 60000),
      status: "pending",
      payout: 138.75,
    },
  ])

  const addTrade = (trade: Trade) => {
    setTrades((prev) => [trade, ...prev])

    // Simulate trade completion after duration
    setTimeout(() => {
      setTrades((prev) =>
        prev.map((t) => (t.id === trade.id ? { ...t, status: Math.random() > 0.3 ? "completed" : "cancelled" } : t)),
      )
    }, 30000) // Complete after 30 seconds for demo
  }

  return <TradesContext.Provider value={{ trades, addTrade }}>{children}</TradesContext.Provider>
}

export function useTrades() {
  const context = useContext(TradesContext)
  if (context === undefined) {
    throw new Error("useTrades must be used within a TradesProvider")
  }
  return context
}
