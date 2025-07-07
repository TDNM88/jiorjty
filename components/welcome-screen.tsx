"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp, Zap, Shield, BarChart3, X } from "lucide-react"

interface WelcomeScreenProps {
  onClose: () => void
}

export function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  const { language, setLanguage, t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t("fast_execution"),
      description: "Execute trades in milliseconds with our advanced infrastructure",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("secure_platform"),
      description: "Bank-level security with multi-layer protection",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t("realtime_data"),
      description: "Real-time market data from multiple exchanges",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-purple-500/20 p-8 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Language Selector */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("en")}
            className="text-xs"
          >
            🇺🇸 EN
          </Button>
          <Button
            variant={language === "vi" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("vi")}
            className="text-xs"
          >
            🇻🇳 VI
          </Button>
        </div>

        <div className="text-center mb-8 mt-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 gradient-text">{t("title")}</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">{t("welcome_title")}</h2>
          <p className="text-slate-300 text-lg max-w-lg mx-auto">{t("welcome_subtitle")}</p>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 rounded-lg p-6 text-center transition-all duration-500 ${
                currentStep === index ? "ring-2 ring-purple-500 scale-105" : ""
              }`}
            >
              <div className="text-purple-400 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">98.9%</div>
            <div className="text-slate-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">50K+</div>
            <div className="text-slate-400 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">$2.4B</div>
            <div className="text-slate-400 text-sm">Volume Traded</div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            {t("get_started")}
            <TrendingUp className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </Card>
    </div>
  )
}
