"use client"

import { Exchange } from "@/components/exchange/Exchange"

export default function ExchangePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Chuyển đổi tiền tệ</h1>
        <div className="flex justify-center">
          <Exchange />
        </div>
      </div>
    </div>
  )
}
