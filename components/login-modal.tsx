"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Wallet } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await login(username, password)
      if (success) {
        // Play success sound
        if ((window as any).playSuccessSound) {
          ;(window as any).playSuccessSound()
        }
        onClose()
        setUsername("")
        setPassword("")
      } else {
        // Play error sound
        if ((window as any).playErrorSound) {
          ;(window as any).playErrorSound()
        }
        setError(t("invalid_credentials"))
      }
    } catch (err) {
      if ((window as any).playErrorSound) {
        ;(window as any).playErrorSound()
      }
      setError(t("login_failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-white">
            <Wallet className="w-5 h-5" />
            <span>{t("connect_wallet")}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300">
              {t("username")}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder={t("enter_username")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder={t("enter_password")}
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? t("connecting") : t("connect_wallet")}
          </Button>

          <div className="text-center text-sm text-slate-400 bg-slate-700/50 p-3 rounded-md">
            <strong>{t("demo_account")}:</strong>
            <br />
            {t("username")}: demo
            <br />
            {t("password")}: demo123
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
