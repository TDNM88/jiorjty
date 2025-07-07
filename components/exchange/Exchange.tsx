"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { ArrowDownUp } from 'lucide-react';

const CURRENCIES = [
  { code: 'USDT', name: 'Tether (USDT)' },
  { code: 'USD', name: 'US Dollar (USD)' },
  { code: 'VND', name: 'Vietnamese Dong (VND)' },
  { code: 'CNY', name: 'Chinese Yuan (CNY)' },
  { code: 'JPY', name: 'Japanese Yen (JPY)' },
  { code: 'EUR', name: 'Euro (EUR)' },
];

export function Exchange() {
  const { rates, loading, error } = useExchangeRates();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USDT');
  const [toCurrency, setToCurrency] = useState('VND');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [rate, setRate] = useState<number>(0);

  useEffect(() => {
    if (!rates) return;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const newRate = toRate / fromRate;
    setRate(newRate);
    
    const numAmount = parseFloat(amount) || 0;
    const result = (numAmount * newRate).toFixed(2);
    setConvertedAmount(result);
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading) return <div>Đang tải tỷ giá...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chuyển đổi tiền tệ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Số lượng</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số lượng"
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn tiền tệ" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwapCurrencies}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Đổi vị trí"
            >
              <ArrowDownUp className="h-5 w-5" />
            </button>
          </div>

          <div>
            <Label>Đổi thành</Label>
            <div className="flex space-x-2">
              <div className="flex-1 flex items-center px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-900">
                {convertedAmount}
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn tiền tệ" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
