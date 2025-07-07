import { useState, useEffect } from 'react';
import { useBankTransaction } from '@/hooks/use-bank-transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { BankAccount } from '@/types/bank';

// Define the return type of useBankTransaction
interface BankTransactionHook {
  bankAccounts: BankAccount[];
  transactions: any[];
  isLoading: boolean;
  error: string | null;
  deposit: (amount: number, bankAccountId: string) => Promise<any>;
  withdraw: (amount: number, bankAccountId: string) => Promise<any>;
  addBankAccount: (account: Omit<BankAccount, 'id' | 'isDefault'>) => Promise<BankAccount>;
  removeBankAccount: (accountId: string) => Promise<void>;
  setDefaultAccount: (accountId: string) => Promise<void>;
}

interface BankTransactionFormProps {
  type: 'deposit' | 'withdraw';
  onSuccess?: () => void;
}

export function BankTransactionForm({ type, onSuccess }: BankTransactionFormProps) {
  const { 
    bankAccounts = [], 
    isLoading = false, 
    error = null, 
    deposit = async () => ({}), 
    withdraw = async () => ({}),
    addBankAccount = async () => ({} as BankAccount),
    removeBankAccount = async () => {},
    setDefaultAccount = async () => {},
  } = useBankTransaction() as unknown as BankTransactionHook;

  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<BankAccount, 'id' | 'isDefault'>>({ 
    bankName: '',
    accountNumber: '',
    accountName: '',
    branch: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Set default account if available
    if (bankAccounts.length > 0 && !selectedAccountId) {
      const defaultAccount = bankAccounts.find(acc => acc.isDefault) || bankAccounts[0];
      setSelectedAccountId(defaultAccount.id);
    }
  }, [bankAccounts, selectedAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedAccountId) return;
    
    try {
      if (type === 'deposit') {
        await deposit(Number(amount), selectedAccountId);
      } else {
        await withdraw(Number(amount), selectedAccountId);
      }
      
      setIsSuccess(true);
      setAmount('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addBankAccount(newAccount);
      setShowAddAccount(false);
      setNewAccount({ 
        bankName: '',
        accountNumber: '',
        accountName: '',
        branch: ''
      });
    } catch (err) {
      console.error('Error adding bank account:', err);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Giao dịch thành công!</h3>
        <p className="text-sm text-muted-foreground">
          {type === 'deposit' ? 'Tiền sẽ được cộng vào tài khoản của bạn trong giây lát.' : 'Yêu cầu rút tiền của bạn đã được ghi nhận.'}
        </p>
        <Button 
          className="mt-4" 
          onClick={() => setIsSuccess(false)}
        >
          Thực hiện giao dịch mới
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {type === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {type === 'deposit' 
            ? 'Chọn tài khoản ngân hàng và số tiền bạn muốn nạp.' 
            : 'Chọn tài khoản ngân hàng và số tiền bạn muốn rút.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Số tiền (VND)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số tiền"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10000"
              step="1000"
              required
              className="pl-8"
            />
            <span className="absolute left-3 top-2.5 text-muted-foreground">₫</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Số tiền tối thiểu: 10,000 VND
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bank-account">Tài khoản ngân hàng</Label>
            <button
              type="button"
              onClick={() => setShowAddAccount(!showAddAccount)}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              {showAddAccount ? 'Hủy' : 'Thêm tài khoản'}
            </button>
          </div>
          
          {showAddAccount ? (
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Ngân hàng</Label>
                <Input
                  id="bank-name"
                  placeholder="VD: Vietcombank, Techcombank, ..."
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Số tài khoản</Label>
                <Input
                  id="account-number"
                  placeholder="Nhập số tài khoản"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-name">Tên chủ tài khoản</Label>
                <Input
                  id="account-name"
                  placeholder="Nhập tên chủ tài khoản"
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Chi nhánh (tùy chọn)</Label>
                <Input
                  id="branch"
                  placeholder="VD: Chi nhánh Hà Nội"
                  value={newAccount.branch || ''}
                  onChange={(e) => setNewAccount({...newAccount, branch: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddAccount}
                  className="flex-1"
                  disabled={!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountName}
                >
                  Lưu tài khoản
                </Button>
              </div>
            </Card>
          ) : (
            <Select 
              value={selectedAccountId} 
              onValueChange={setSelectedAccountId}
              disabled={bankAccounts.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  bankAccounts.length === 0 
                    ? "Chưa có tài khoản nào" 
                    : "Chọn tài khoản ngân hàng"
                } />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts?.map((account: BankAccount) => (
                  <div key={account.id} className="relative">
                    <SelectItem value={account.id}>
                      <div className="flex flex-col">
                        <div className="font-medium">{account.bankName} ••••{account.accountNumber.slice(-4)}</div>
                        <div className="text-xs text-muted-foreground">{account.accountName}</div>
                      </div>
                    </SelectItem>
                    {account.isDefault && (
                      <Badge 
                        variant="secondary" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                      >
                        Mặc định
                      </Badge>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {bankAccounts.length > 0 && !showAddAccount && (
            <div className="space-y-2">
              {bankAccounts
                .filter((acc: BankAccount) => acc.id === selectedAccountId)
                .map((account: BankAccount) => (
                  <div key={account.id} className="text-sm p-3 bg-muted/30 rounded-md">
                    <div className="font-medium">{account.bankName}</div>
                    <div className="text-muted-foreground">Số tài khoản: {account.accountNumber}</div>
                    <div className="text-muted-foreground">Chủ tài khoản: {account.accountName}</div>
                    {account.branch && (
                      <div className="text-muted-foreground">Chi nhánh: {account.branch}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setDefaultAccount(account.id)}
                        disabled={account.isDefault}
                        className="text-xs text-primary hover:underline disabled:opacity-50"
                      >
                        Đặt làm mặc định
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBankAccount(account.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || bankAccounts.length === 0 || !amount}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : type === 'deposit' ? (
            'Xác nhận nạp tiền'
          ) : (
            'Xác nhận rút tiền'
          )}
        </Button>
      </form>

      {type === 'deposit' && (
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Hướng dẫn nạp tiền:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Chọn tài khoản ngân hàng hoặc thêm mới nếu cần</li>
            <li>Nhập số tiền muốn nạp (tối thiểu 10,000 VNĐ)</li>
            <li>Nhấn "Xác nhận nạp tiền"</li>
            <li>Chuyển khoản theo thông tin ngân hàng được cung cấp</li>
            <li>Tiền sẽ được cộng vào tài khoản sau 5-10 phút</li>
          </ol>
        </div>
      )}

      {type === 'withdraw' && (
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Lưu ý khi rút tiền:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Phí rút tiền: 1% (tối thiểu 5,000 VNĐ)</li>
            <li>Thời gian xử lý: 15-30 phút trong giờ hành chính</li>
            <li>Số tiền tối thiểu mỗi lần rút: 50,000 VNĐ</li>
            <li>Hạn mức rút tối đa: 100,000,000 VNĐ/ngày</li>
          </ul>
        </div>
      )}
    </div>
  );
}
