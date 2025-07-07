"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TradingChart } from "@/components/trading-chart"
import { TradePanel } from "@/components/trade-panel"
import { WalletCard } from "@/components/wallet-card"
import { BankTransaction } from "@/components/bank-transaction"
import { TradeHistory } from "@/components/trade-history"
import { Header } from "@/components/header"
import { WelcomeScreen } from "@/components/welcome-screen"
import { LoadingScreen } from "@/components/loading-screen"
import { LanguageSelectionModal } from "@/components/language-selection-modal"
import { NotificationSystem, useNotifications } from "@/components/notification-system"
import { SoundManager } from "@/components/sound-manager"
import { useAuth } from "@/hooks/use-auth"
import { useTradingData } from "@/hooks/use-trading-data"
import { useLanguage } from "@/hooks/use-language"
import { getAssetBySymbol } from "@/lib/assets-data"
import { TrendingUp, TrendingDown, Activity, Banknote } from "lucide-react"

export default function TradingPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const { notifications, addNotification: _addNotification, removeNotification } = useNotifications()
  
  // Memoize addNotification function to prevent infinite loop
  const addNotification = useCallback(_addNotification, [])
  
  const [selectedAsset, setSelectedAsset] = useState("BTC")
  const [showBankTransaction, setShowBankTransaction] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  const { currentPrice, priceChange, chartData } = useTradingData(selectedAsset)

  const asset = getAssetBySymbol(selectedAsset)

  useEffect(() => {
    // Check if user needs to select language
    const languageSelected = localStorage.getItem("languageSelected")
    const hasVisited = localStorage.getItem("hasVisited")

    if (!languageSelected) {
      setShowLanguageSelection(true)
    } else if (!hasVisited) {
      setShowWelcome(true)
      localStorage.setItem("hasVisited", "true")
    }
  }, [])

  useEffect(() => {
    // Add welcome notification when user logs in
    if (user) {
      addNotification({
        type: "success",
        title: language === "vi" ? "Chào mừng trở lại!" : "Welcome back!",
        message:
          language === "vi" ? `Xin chào ${user.name}, sẵn sàng giao dịch?` : `Hello ${user.name}, ready to trade?`,
      })
    }
  }, [user, addNotification, language])

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />
  }

  if (showBankTransaction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-4 pt-24">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ngân hàng</h1>
            <Button 
              variant="outline" 
              onClick={() => setShowBankTransaction(false)}
              className="flex items-center gap-2"
            >
              Quay lại giao dịch
            </Button>
          </div>
          <div className="flex justify-center">
            <BankTransaction />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <SoundManager enabled={soundEnabled} />
      <NotificationSystem notifications={notifications} onRemove={removeNotification} />

      {showLanguageSelection && (
        <LanguageSelectionModal open={showLanguageSelection} onClose={() => setShowLanguageSelection(false)} />
      )}

      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {asset && (
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${asset.color} flex items-center justify-center text-xl font-bold text-white`}
                      >
                        {asset.icon}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          ${(currentPrice || 0).toFixed(2)}
                          <span
                            className={`ml-2 text-sm ${(priceChange || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {(priceChange || 0) >= 0 ? '↑' : '↓'} {Math.abs(priceChange || 0).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-sm text-slate-400">{t("price")}</div>
                  </div>
                </div>
                <Badge
                  variant={priceChange >= 0 ? "default" : "destructive"}
                  className={`${priceChange >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </Badge>
              </div>
              <TradingChart data={chartData} selectedAsset={selectedAsset} />
            </Card>

            {/* Trade History */}
            <TradeHistory />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <WalletCard />

            {/* Trade Panel */}
            <TradePanel
              selectedAsset={selectedAsset}
              onAssetChange={setSelectedAsset}
              onTradePlace={(trade) => {
                addNotification({
                  type: "trade",
                  title: t("trade_placed_successfully"),
                  message: `${trade.type.toUpperCase()} ${trade.amount} USDT on ${trade.asset}`,
                })
                if ((window as any).playTradeSound) {
                  ;(window as any).playTradeSound()
                }
              }}
            />

            {/* Quick Stats */}
            <Card className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                {t("market_stats")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("volume_24h")}</span>
                  <span className="text-white font-medium">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("active_traders")}</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t("success_rate")}</span>
                  <span className="text-green-400 font-medium">73.2%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
