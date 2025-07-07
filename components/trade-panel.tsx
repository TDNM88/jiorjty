"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useTrades } from "@/hooks/use-trades"
import { useLanguage } from "@/hooks/use-language"
import { assetsData, getAssetBySymbol } from "@/lib/assets-data"
import { TrendingUp, TrendingDown, Target } from "lucide-react"

interface TradePanelProps {
  selectedAsset: string
  onAssetChange: (asset: string) => void
  onTradePlace?: (trade: any) => void
}

const durations = [
  { value: "30s", label: "30 Seconds", labelVi: "30 Giây" },
  { value: "1m", label: "1 Minute", labelVi: "1 Phút" },
  { value: "5m", label: "5 Minutes", labelVi: "5 Phút" },
  { value: "15m", label: "15 Minutes", labelVi: "15 Phút" },
  { value: "30m", label: "30 Minutes", labelVi: "30 Phút" },
  { value: "1h", label: "1 Hour", labelVi: "1 Giờ" },
]

export function TradePanel({ selectedAsset, onAssetChange, onTradePlace }: TradePanelProps) {
  const { user } = useAuth()
  const { addTrade } = useTrades()
  const { t, language } = useLanguage()
  const [tradeType, setTradeType] = useState<"up" | "down">("up")
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("1m")
  const [potentialPayout, setPotentialPayout] = useState(0)

  const asset = getAssetBySymbol(selectedAsset)

  useEffect(() => {
    const amountNum = Number.parseFloat(amount) || 0
    setPotentialPayout(amountNum * 1.85) // 85% payout
  }, [amount])

  const handleTrade = () => {
    if (!user) {
      alert(t("connect_wallet_first"))
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      alert(t("invalid_amount"))
      return
    }

    if (amountNum > user.balance) {
      alert(t("insufficient_balance"))
      return
    }

    const trade = {
      id: Date.now().toString(),
      asset: selectedAsset,
      type: tradeType,
      amount: amountNum,
      duration,
      timestamp: new Date(),
      status: "pending" as const,
      payout: potentialPayout,
    }

    addTrade(trade)
    setAmount("")
    onTradePlace?.(trade)
  }

  const categoryColors = {
    crypto: "from-purple-500 to-blue-500",
    forex: "from-green-500 to-teal-500",
    commodity: "from-yellow-500 to-orange-500",
    stock: "from-red-500 to-pink-500",
  }

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Target className="w-5 h-5 mr-2" />
          {t("place_trade")}
        </h3>
        <Badge variant="outline" className="border-purple-500 text-purple-400">
          {t("up_to_payout")}
        </Badge>
      </div>

      {/* Trade Type Tabs */}
      <div className="flex bg-slate-700/50 rounded-lg p-1 mb-6">
        <button
          onClick={() => setTradeType("up")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tradeType === "up" ? "bg-green-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          {language === "vi" ? "Tăng" : "Up"}
        </button>
        <button
          onClick={() => setTradeType("down")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            tradeType === "down" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <TrendingDown className="w-4 h-4 inline mr-1" />
          {language === "vi" ? "Giảm" : "Down"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Asset Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300">{language === "vi" ? "Tài Sản" : "Asset"}</Label>
          <Select value={selectedAsset} onValueChange={onAssetChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
              {Object.entries(
                assetsData.reduce(
                  (acc, asset) => {
                    if (!acc[asset.category]) acc[asset.category] = []
                    acc[asset.category].push(asset)
                    return acc
                  },
                  {} as Record<string, typeof assetsData>,
                ),
              ).map(([category, assets]) => (
                <div key={category}>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {category === "crypto"
                      ? language === "vi"
                        ? "Tiền Mã Hóa"
                        : "Cryptocurrency"
                      : category === "forex"
                        ? language === "vi"
                          ? "Ngoại Hối"
                          : "Forex"
                        : category === "commodity"
                          ? language === "vi"
                            ? "Hàng Hóa"
                            : "Commodities"
                          : category === "stock"
                            ? language === "vi"
                              ? "Cổ Phiếu"
                              : "Stocks"
                            : category}
                  </div>
                  {assets.map((asset) => (
                    <SelectItem
                      key={asset.symbol}
                      value={asset.symbol}
                      className="text-white hover:bg-slate-600 flex items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${asset.color} flex items-center justify-center text-xs font-bold text-white`}
                        >
                          {asset.icon}
                        </div>
                        <span>{language === "vi" ? asset.nameVi : asset.name}</span>
                        <span className="text-slate-400 text-xs">({asset.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label className="text-slate-300">{t("amount")} (USDT)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-slate-700 border-slate-600 text-white"
            step="0.01"
            min="0.01"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label className="text-slate-300">{t("duration")}</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {durations.map((dur) => (
                <SelectItem key={dur.value} value={dur.value} className="text-white hover:bg-slate-600">
                  {language === "vi" ? dur.labelVi : dur.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Asset Info */}
        {asset && (
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${asset.color} flex items-center justify-center text-sm font-bold text-white`}
                >
                  {asset.icon}
                </div>
                <span className="text-white font-medium">{language === "vi" ? asset.nameVi : asset.name}</span>
              </div>
              <Badge className={`bg-gradient-to-r ${categoryColors[asset.category]} text-white`}>
                {asset.category.toUpperCase()}
              </Badge>
            </div>
            <div className="text-slate-400 text-sm">
              {language === "vi" ? "Dự đoán giá sẽ" : "Predict price will go"}{" "}
              <span className={tradeType === "up" ? "text-green-400" : "text-red-400"}>
                {tradeType === "up" ? (language === "vi" ? "TĂNG" : "UP") : language === "vi" ? "GIẢM" : "DOWN"}
              </span>
            </div>
          </div>
        )}

        {/* Potential Payout */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">{t("potential_payout")}</span>
            <span className="text-green-400 font-semibold">{potentialPayout.toFixed(2)} USDT</span>
          </div>
        </div>

        {/* Trade Button */}
        <Button
          onClick={handleTrade}
          className={`w-full py-3 font-semibold ${
            tradeType === "up" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
          disabled={!user || !amount}
        >
          {tradeType === "up"
            ? language === "vi"
              ? "Đặt Lệnh TĂNG"
              : "Place UP Order"
            : language === "vi"
              ? "Đặt Lệnh GIẢM"
              : "Place DOWN Order"}
        </Button>
      </div>
    </Card>
  )
}
