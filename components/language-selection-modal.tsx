"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { Globe, Check } from "lucide-react"

interface LanguageSelectionModalProps {
  open: boolean
  onClose: () => void
}

export function LanguageSelectionModal({ open, onClose }: LanguageSelectionModalProps) {
  const { language, setLanguage, t } = useLanguage()
  const [selectedLang, setSelectedLang] = useState<"en" | "vi">(language)

  const handleConfirm = () => {
    setLanguage(selectedLang)
    localStorage.setItem("languageSelected", "true")
    onClose()
  }

  const languages = [
    {
      code: "en" as const,
      name: t('language.english'),
      flag: "🇺🇸",
      description: t('language.englishDescription'),
    },
    {
      code: "vi" as const,
      name: t('language.vietnamese'),
      flag: "🇻🇳",
      description: t('language.vietnameseDescription'),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogTitle className="sr-only">Chọn ngôn ngữ / Select Language</DialogTitle>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">
            {t('language.selectLanguage')}
          </h2>

          <div className="space-y-3 mb-8">
            {languages.map((lang) => (
              <Card
                key={lang.code}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedLang === lang.code
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                }`}
                onClick={() => setSelectedLang(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="text-white font-semibold">{lang.name}</div>
                      <div className="text-slate-400 text-sm">{lang.description}</div>
                    </div>
                  </div>
                  {selectedLang === lang.code && <Check className="w-5 h-5 text-purple-400" />}
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
          >
            {t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
