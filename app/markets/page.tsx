"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp, TrendingDown, Search, Star } from "lucide-react"
import { mockMarketData } from "@/lib/assets-data"

export default function MarketsPage() {
  const { t, language } = useLanguage()
  const [markets, setMarkets] = useState(mockMarketData)
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<string[]>(["BTC", "ETH", "SOL"])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { value: "all", label: language === "vi" ? "Tất Cả" : "All" },
    { value: "crypto", label: language === "vi" ? "Tiền Mã Hóa" : "Crypto" },
    { value: "forex", label: language === "vi" ? "Ngoại Hối" : "Forex" },
    { value: "commodity", label: language === "vi" ? "Hàng Hóa" : "Commodities" },
  ]

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (language === "vi" && market.nameVi.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || market.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets((prev) =>
        prev.map((market) => ({
          ...market,
          price: market.price * (1 + (Math.random() - 0.5) * 0.002),
          change24h: market.change24h + (Math.random() - 0.5) * 0.5,
          volume: market.volume * (1 + (Math.random() - 0.5) * 0.1),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("markets")}</h1>
          <p className="text-slate-400">
            {language === "vi" ? "Dữ liệu thị trường tài sản thời gian thực" : "Real-time asset market data"}
          </p>
        </div>

        <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder={t("search_markets")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`${
                    selectedCategory === category.value
                      ? "bg-purple-600 text-white"
                      : "border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    {language === "vi" ? "Tài Sản" : "Asset"}
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">{t("price")}</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">{t("change_24h")}</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">{t("volume")}</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">{t("market_cap")}</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((market) => (
                  <tr
                    key={market.symbol}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleFavorite(market.symbol)}
                          className={`${favorites.includes(market.symbol) ? "text-yellow-400" : "text-slate-500"} hover:text-yellow-400 transition-colors`}
                        >
                          <Star
                            className="w-4 h-4"
                            fill={favorites.includes(market.symbol) ? "currentColor" : "none"}
                          />
                        </button>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 bg-gradient-to-r ${market.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                          >
                            {market.icon}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {language === "vi" ? market.nameVi : market.name}
                            </div>
                            <div className="text-slate-400 text-sm">{market.symbol}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="text-white font-medium">${market.price.toFixed(market.price > 1 ? 2 : 6)}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Badge
                        variant={market.change24h >= 0 ? "default" : "destructive"}
                        className={`${market.change24h >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {market.change24h >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {market.change24h >= 0 ? "+" : ""}
                        {market.change24h.toFixed(2)}%
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right text-white">${(market.volume / 1000000).toFixed(2)}M</td>
                    <td className="py-4 px-4 text-right text-white">${(market.marketCap / 1000000000).toFixed(2)}B</td>
                    <td className="py-4 px-4 text-center">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        {language === "vi" ? "Giao Dịch" : "Trade"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
