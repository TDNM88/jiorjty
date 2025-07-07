import { useState, useCallback } from 'react';
import { BankAccount, Transaction } from '@/types/bank';
import { v4 as uuidv4 } from 'uuid';

// Mock data for bank accounts
const mockBankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'Vietcombank',
    accountNumber: '0123456789',
    accountName: 'NGUYEN VAN A',
    branch: 'Chi nhánh Hà Nội',
    isDefault: true,
  },
  {
    id: '2',
    bankName: 'Techcombank',
    accountNumber: '9876543210',
    accountName: 'NGUYEN VAN A',
    branch: 'Chi nhánh TP.HCM',
    isDefault: false,
  },
];

export const useBankTransaction = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to simulate API call
  const simulateAPICall = async <T>(data: T, success = true, delay = 1500): Promise<T> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve(data);
        } else {
          reject(new Error('Có lỗi xảy ra. Vui lòng thử lại sau.'));
        }
      }, delay);
    });
  };

  const deposit = useCallback(async (amount: number, bankAccountId: string): Promise<Transaction> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const bankAccount = bankAccounts.find(acc => acc.id === bankAccountId);
      if (!bankAccount) {
        throw new Error('Không tìm thấy tài khoản ngân hàng');
      }

      const newTransaction: Transaction = {
        id: uuidv4(),
        type: 'deposit',
        amount,
        bankAccount,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        referenceNumber: `DEP${Date.now()}`,
      };

      await simulateAPICall(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [bankAccounts]);

  const withdraw = useCallback(async (amount: number, bankAccountId: string): Promise<Transaction> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const bankAccount = bankAccounts.find(acc => acc.id === bankAccountId);
      if (!bankAccount) {
        throw new Error('Không tìm thấy tài khoản ngân hàng');
      }

      const newTransaction: Transaction = {
        id: uuidv4(),
        type: 'withdraw',
        amount,
        bankAccount,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        referenceNumber: `WDR${Date.now()}`,
      };

      await simulateAPICall(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [bankAccounts]);

  const addBankAccount = useCallback(async (bankAccount: Omit<BankAccount, 'id' | 'isDefault'>): Promise<BankAccount> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newAccount: BankAccount = {
        ...bankAccount,
        id: uuidv4(),
        isDefault: bankAccounts.length === 0, // Set as default if it's the first account
      };

      await simulateAPICall(newAccount);
      setBankAccounts(prev => [...prev, newAccount]);
      
      return newAccount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [bankAccounts.length]);

  const removeBankAccount = useCallback(async (accountId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await simulateAPICall({ success: true });
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDefaultAccount = useCallback(async (accountId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await simulateAPICall({ success: true });
      setBankAccounts(prev => 
        prev.map(acc => ({
          ...acc,
          isDefault: acc.id === accountId
        }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    bankAccounts,
    transactions,
    isLoading,
    error,
    deposit,
    withdraw,
    addBankAccount,
    removeBankAccount,
    setDefaultAccount,
  };
};
