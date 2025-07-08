"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { ArrowDownUp, Banknote, Landmark, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CURRENCIES = [
  { code: 'USDT', name: 'Tether (USDT)', icon: <Wallet className="w-4 h-4 mr-2" /> },
  { code: 'USD', name: 'US Dollar (USD)', icon: <Banknote className="w-4 h-4 mr-2" /> },
  { code: 'VND', name: 'Vietnamese Dong (VND)', icon: <Banknote className="w-4 h-4 mr-2" /> },
  { code: 'CNY', name: 'Chinese Yuan (CNY)', icon: <Banknote className="w-4 h-4 mr-2" /> },
  { code: 'JPY', name: 'Japanese Yen (JPY)', icon: <Banknote className="w-4 h-4 mr-2" /> },
  { code: 'EUR', name: 'Euro (EUR)', icon: <Banknote className="w-4 h-4 mr-2" /> },
];

const BANKS = [
  { id: 'vcb', name: 'Vietcombank', shortName: 'VCB' },
  { id: 'vib', name: 'VIB', shortName: 'VIB' },
  { id: 'tcb', name: 'Techcombank', shortName: 'TCB' },
  { id: 'mb', name: 'Military Bank', shortName: 'MB' },
  { id: 'bidv', name: 'BIDV', shortName: 'BIDV' },
];

export function Exchange() {
  const { rates, loading, error } = useExchangeRates();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USDT');
  const [toCurrency, setToCurrency] = useState('VND');
  const [convertedAmount, setConvertedAmount] = useState<string>('');
  const [rate, setRate] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState(BANKS[0].id);
  const [depositAmount, setDepositAmount] = useState('');

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

  const handleDeposit = () => {
    // Xử lý logic nạp tiền ở đây
    alert(`Đã gửi yêu cầu nạp ${depositAmount} ${fromCurrency} qua ngân hàng ${BANKS.find(b => b.id === selectedBank)?.name}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDownUp className="w-6 h-6" />
            <span>Chuyển đổi tiền tệ</span>
          </CardTitle>
          <CardDescription>Chuyển đổi giữa các loại tiền tệ với tỷ giá thời gian thực</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="amount" className="block mb-2">Số lượng</Label>
              <div className="flex gap-3">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số lượng"
                  className="flex-1 text-lg py-6"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-[200px] py-6">
                    <SelectValue placeholder="Chọn tiền tệ" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code} className="py-3">
                        <div className="flex items-center">
                          {currency.icon}
                          {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwapCurrencies}
                className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                aria-label="Đổi vị trí"
              >
                <ArrowDownUp className="h-6 w-6" />
              </button>
            </div>

            <div>
              <Label className="block mb-2">Đổi thành</Label>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center px-4 py-5 border rounded-md bg-muted text-lg font-medium">
                  {convertedAmount}
                </div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-[200px] py-6">
                    <SelectValue placeholder="Chọn tiền tệ" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code} className="py-3">
                        <div className="flex items-center">
                          {currency.icon}
                          {currency.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-lg text-center">
              <p className="text-sm font-medium">
                1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tỷ giá được cập nhật theo thời gian thực
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="w-6 h-6" />
            <span>Nạp tiền qua chuyển khoản ngân hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bank-transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bank-transfer">Chuyển khoản ngân hàng</TabsTrigger>
              <TabsTrigger value="other-methods">Phương thức khác</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bank-transfer">
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="deposit-amount">Số tiền muốn nạp</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    className="mt-2 py-5 text-lg"
                  />
                </div>
                
                <div>
                  <Label>Ngân hàng nhận tiền</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {BANKS.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 border rounded-lg flex flex-col items-center transition-colors ${
                          selectedBank === bank.id 
                            ? 'border-primary bg-primary/10' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium">{bank.shortName}</div>
                        <div className="text-xs text-muted-foreground">{bank.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Thông tin chuyển khoản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số tài khoản:</span>
                      <span>1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chủ tài khoản:</span>
                      <span>CÔNG TY HAYX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chi nhánh:</span>
                      <span>Hà Nội</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nội dung:</span>
                      <span>NAP {depositAmount || '0'} {fromCurrency}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDeposit}
                  className="w-full py-6 text-lg"
                  disabled={!depositAmount}
                >
                  Xác nhận nạp tiền
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="other-methods">
              <div className="p-4 text-center text-muted-foreground">
                <p>Các phương thức nạp tiền khác đang được phát triển</p>
                <p className="text-sm mt-2">Vui lòng sử dụng tính năng chuyển khoản ngân hàng</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}