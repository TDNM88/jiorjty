import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankTransactionForm } from './bank-transaction-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export function BankTransaction() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          <CardTitle>Nạp/Rút tiền</CardTitle>
        </div>
        <CardDescription>
          Thực hiện giao dịch nạp/rút tiền nhanh chóng và an toàn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Nạp tiền
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <ArrowUpFromLine className="h-4 w-4" />
              Rút tiền
            </TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="pt-4">
            <BankTransactionForm type="deposit" />
          </TabsContent>
          <TabsContent value="withdraw" className="pt-4">
            <BankTransactionForm type="withdraw" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
