"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTrades } from "@/hooks/use-trades"
import { History, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react"

export function TradeHistory() {
  const { trades } = useTrades()
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all")

  const filteredTrades = trades.filter((trade) => filter === "all" || trade.status === filter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <History className="w-5 h-5 mr-2" />
          Trade History
        </h3>
        <div className="flex space-x-2">
          {["all", "pending", "completed", "cancelled"].map((filterType) => (
            <Button
              key={filterType}
              variant="outline"
              size="sm"
              onClick={() => setFilter(filterType as any)}
              className={`border-slate-600 text-slate-300 hover:bg-slate-700 ${
                filter === filterType ? "bg-purple-600 border-purple-600 text-white" : ""
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Pair</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Duration</th>
              <th className="text-center py-3 px-4 text-slate-400 font-medium">Status</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">P&L</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  No trades found
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {trade.asset?.charAt(0) || '?'}
                      </div>
                      <span className="text-white font-medium">{trade.asset || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={`${trade.type === "up" ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}`}
                    >
                      {trade.type === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {trade.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right text-white">{trade.amount.toFixed(4)}</td>
                  <td className="py-4 px-4 text-right text-slate-300">{trade.duration}</td>
                  <td className="py-4 px-4 text-center">
                    <Badge className={getStatusColor(trade.status)}>
                      {getStatusIcon(trade.status)}
                      <span className="ml-1">{trade.status}</span>
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {trade.status === "completed" ? (
                      <span className={`font-medium ${Math.random() > 0.3 ? "text-green-400" : "text-red-400"}`}>
                        {Math.random() > 0.3 ? "+" : "-"}${(trade.amount * 0.85).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right text-slate-300">{trade.timestamp.toLocaleTimeString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
