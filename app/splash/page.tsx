"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp, Zap, Shield, BarChart3 } from "lucide-react"

export default function SplashPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t("fast_execution"),
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("secure_platform"),
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t("realtime_data"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 text-center">
        {/* Language Selector */}
        <div className="flex justify-center space-x-2 mb-8">
          <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")}>
            🇺🇸 English
          </Button>
          <Button variant={language === "vi" ? "default" : "outline"} size="sm" onClick={() => setLanguage("vi")}>
            🇻🇳 Tiếng Việt
          </Button>
        </div>

        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <TrendingUp className="w-12 h-12 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-4 gradient-text">{t("title")}</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">{t("welcome_title")}</h2>
        <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-12">{t("welcome_subtitle")}</p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-700/30 rounded-lg p-6">
              <div className="text-purple-400 mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold"
        >
          {t("get_started")}
          <TrendingUp className="w-6 h-6 ml-2" />
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-700">
          <div>
            <div className="text-3xl font-bold text-green-400">98.9%</div>
            <div className="text-slate-400">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">50K+</div>
            <div className="text-slate-400">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">$2.4B</div>
            <div className="text-slate-400">Volume Traded</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
