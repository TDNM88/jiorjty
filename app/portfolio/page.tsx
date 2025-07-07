"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { mockPortfolioData } from "@/lib/mock-data"
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, PieChart, BarChart3 } from "lucide-react"

export default function PortfolioPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(mockPortfolioData)
  const [totalValue, setTotalValue] = useState(0)
  const [totalPnL, setTotalPnL] = useState(0)

  useEffect(() => {
    const total = portfolio.reduce((sum, asset) => sum + asset.value, 0)
    const pnl = portfolio.reduce((sum, asset) => sum + (asset.value * asset.change24h) / 100, 0)
    setTotalValue(total)
    setTotalPnL(pnl)
  }, [portfolio])

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prev) =>
        prev.map((asset) => ({
          ...asset,
          price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
          change24h: asset.change24h + (Math.random() - 0.5) * 0.5,
          value: asset.amount * asset.price * (1 + (Math.random() - 0.5) * 0.002),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-8">
          <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">Please connect your wallet to view your portfolio</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Connect Wallet</Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400">Track your trading performance and assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Portfolio Overview */}
          <Card className="lg:col-span-3 p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Portfolio Overview
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 bg-transparent">
                  <Plus className="w-4 h-4 mr-1" />
                  Deposit
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 bg-transparent">
                  <Minus className="w-4 h-4 mr-1" />
                  Withdraw
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Total Balance</div>
                <div className="text-2xl font-bold text-white">${totalValue.toFixed(2)}</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">24h P&L</div>
                <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Total Assets</div>
                <div className="text-2xl font-bold text-white">{portfolio.length}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Asset</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Value</th>
                    <th className="text-right py-3 px-4 text-slate-400 font-medium">24h Change</th>
                    <th className="text-center py-3 px-4 text-slate-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((asset) => (
                    <tr
                      key={asset.symbol}
                      className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {asset.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{asset.symbol}</div>
                            <div className="text-slate-400 text-sm">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-white">{asset.amount.toFixed(4)}</td>
                      <td className="py-4 px-4 text-right text-white">
                        ${asset.price.toFixed(asset.price > 1 ? 2 : 6)}
                      </td>
                      <td className="py-4 px-4 text-right text-white font-medium">${asset.value.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">
                        <Badge
                          variant={asset.change24h >= 0 ? "default" : "destructive"}
                          className={`${asset.change24h >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                        >
                          {asset.change24h >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {asset.change24h >= 0 ? "+" : ""}
                          {asset.change24h.toFixed(2)}%
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Trade
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Portfolio Stats */}
          <div className="space-y-6">
            <Card className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Win Rate</span>
                  <span className="text-green-400 font-medium">68.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Trades</span>
                  <span className="text-white font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Best Trade</span>
                  <span className="text-green-400 font-medium">+$1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Worst Trade</span>
                  <span className="text-red-400 font-medium">-$340</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">SOL Buy</span>
                  </div>
                  <span className="text-green-400 text-sm">+$125</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">BTC Sell</span>
                  </div>
                  <span className="text-red-400 text-sm">-$45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300 text-sm">ETH Buy</span>
                  </div>
                  <span className="text-green-400 text-sm">+$89</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
