export interface Asset {
  symbol: string
  name: string
  nameVi: string
  icon: string
  basePrice: number
  volatility: number
  category: "crypto" | "forex" | "commodity" | "stock"
  color: string
}

export const assetsData: Asset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    nameVi: "Bitcoin",
    icon: "₿",
    basePrice: 43250,
    volatility: 1000,
    category: "crypto",
    color: "from-orange-500 to-yellow-500",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    nameVi: "Ethereum",
    icon: "Ξ",
    basePrice: 2650,
    volatility: 100,
    category: "crypto",
    color: "from-blue-500 to-purple-500",
  },
  {
    symbol: "SOL",
    name: "Solana",
    nameVi: "Solana",
    icon: "◎",
    basePrice: 150,
    volatility: 10,
    category: "crypto",
    color: "from-purple-500 to-pink-500",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    nameVi: "Binance Coin",
    icon: "⬡",
    basePrice: 315,
    volatility: 20,
    category: "crypto",
    color: "from-yellow-500 to-orange-500",
  },
  {
    symbol: "ADA",
    name: "Cardano",
    nameVi: "Cardano",
    icon: "₳",
    basePrice: 0.485,
    volatility: 0.05,
    category: "crypto",
    color: "from-blue-500 to-cyan-500",
  },
  {
    symbol: "XRP",
    name: "Ripple",
    nameVi: "Ripple",
    icon: "✕",
    basePrice: 0.625,
    volatility: 0.07,
    category: "crypto",
    color: "from-gray-500 to-blue-500",
  },
  {
    symbol: "GOLD",
    name: "Gold",
    nameVi: "Vàng",
    icon: "🥇",
    basePrice: 1985,
    volatility: 50,
    category: "commodity",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    symbol: "SILVER",
    name: "Silver",
    nameVi: "Bạc",
    icon: "🥈",
    basePrice: 24.5,
    volatility: 2,
    category: "commodity",
    color: "from-gray-400 to-gray-600",
  },
  {
    symbol: "OIL",
    name: "Crude Oil",
    nameVi: "Dầu Thô",
    icon: "🛢️",
    basePrice: 78.5,
    volatility: 5,
    category: "commodity",
    color: "from-black to-gray-700",
  },
  {
    symbol: "EUR",
    name: "Euro",
    nameVi: "Euro",
    icon: "€",
    basePrice: 1.085,
    volatility: 0.01,
    category: "forex",
    color: "from-blue-600 to-blue-800",
  },
  {
    symbol: "GBP",
    name: "British Pound",
    nameVi: "Bảng Anh",
    icon: "£",
    basePrice: 1.265,
    volatility: 0.015,
    category: "forex",
    color: "from-red-600 to-red-800",
  },
  {
    symbol: "JPY",
    name: "Japanese Yen",
    nameVi: "Yên Nhật",
    icon: "¥",
    basePrice: 0.0067,
    volatility: 0.0002,
    category: "forex",
    color: "from-red-500 to-pink-500",
  },
]

export const getAssetBySymbol = (symbol: string): Asset | undefined => {
  return assetsData.find((asset) => asset.symbol === symbol)
}

export const getAssetsByCategory = (category: Asset["category"]): Asset[] => {
  return assetsData.filter((asset) => asset.category === category)
}

export const mockMarketData = assetsData.map((asset) => ({
  symbol: asset.symbol,
  name: asset.name,
  nameVi: asset.nameVi,
  price: asset.basePrice + (Math.random() - 0.5) * asset.volatility * 0.1,
  change24h: (Math.random() - 0.5) * 10,
  volume: Math.random() * 10000000 + 1000000,
  marketCap: Math.random() * 100000000000 + 10000000000,
  category: asset.category,
  icon: asset.icon,
  color: asset.color,
}))

export const mockPortfolioData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    nameVi: "Bitcoin",
    amount: 0.125,
    price: 43250,
    value: 5406.25,
    change24h: -1.23,
    icon: "₿",
    color: "from-orange-500 to-yellow-500",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    nameVi: "Ethereum",
    amount: 1.85,
    price: 2650,
    value: 4902.5,
    change24h: 3.67,
    icon: "Ξ",
    color: "from-blue-500 to-purple-500",
  },
  {
    symbol: "SOL",
    name: "Solana",
    nameVi: "Solana",
    amount: 25.5,
    price: 150,
    value: 3825,
    change24h: 2.45,
    icon: "◎",
    color: "from-purple-500 to-pink-500",
  },
  {
    symbol: "GOLD",
    name: "Gold",
    nameVi: "Vàng",
    amount: 1.2,
    price: 1985,
    value: 2382,
    change24h: 0.45,
    icon: "🥇",
    color: "from-yellow-400 to-yellow-600",
  },
]
