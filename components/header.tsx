"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { LoginModal } from "@/components/login-modal"
import { TrendingUp, User, LogOut, Menu, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t("trade"), href: "/", current: pathname === "/" },
    { name: t("markets"), href: "/markets", current: pathname === "/markets" },
    { name: t("portfolio"), href: "/portfolio", current: pathname === "/portfolio" },
    { name: t("exchange"), href: "/exchange", current: pathname === "/exchange" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{t("title")}</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex space-x-1">
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="text-xs px-2 py-1"
                >
                  🇺🇸
                </Button>
                <Button
                  variant={language === "vi" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLanguage("vi")}
                  className="text-xs px-2 py-1"
                >
                  🇻🇳
                </Button>
              </div>

              {user ? (
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    ${user?.balance?.toFixed(2) || '0.00'}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium hidden sm:block">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-white">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowLoginModal(true)} className="bg-purple-600 hover:bg-purple-700">
                  {t("connect_wallet")}
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
