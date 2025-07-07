"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Wallet, Plus, Minus } from "lucide-react"

export function WalletCard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm text-center">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
        <p className="text-slate-400 text-sm mb-4">Connect your wallet to start trading</p>
        <Button className="bg-purple-600 hover:bg-purple-700">Connect Now</Button>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Wallet
        </h3>
        <Badge variant="outline" className="border-green-500 text-green-400">
          Connected
        </Badge>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-white mb-1">${(user.balance || 0).toFixed(2)}</div>
        <div className="text-slate-400 text-sm">Total Balance</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-3 text-center">
          <div className="text-green-400 font-semibold">+$127.50</div>
          <div className="text-slate-400 text-xs">Today's P&L</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-3 text-center">
          <div className="text-white font-semibold">73.2%</div>
          <div className="text-slate-400 text-xs">Win Rate</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          onClick={() => alert("Deposit functionality coming soon!")}
        >
          <Plus className="w-4 h-4 mr-1" />
          Deposit
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          onClick={() => alert("Withdraw functionality coming soon!")}
        >
          <Minus className="w-4 h-4 mr-1" />
          Withdraw
        </Button>
      </div>
    </Card>
  )
}
