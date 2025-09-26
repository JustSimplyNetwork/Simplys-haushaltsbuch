
import { useEffect } from 'react';
import { Transaction } from '../types/Transaction';
import { useBankAccounts } from './useBankAccounts';

export const usePayPalIntegration = (
  transactions: Transaction[],
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
) => {
  const { settings } = useBankAccounts();

  useEffect(() => {
    if (settings.enablePayPalSync) {
      handlePayPalBalances();
    }
  }, [settings.accounts, settings.enablePayPalSync]);

  const handlePayPalBalances = async () => {
    const paypalAccounts = settings.accounts.filter(
      account => account.type === 'paypal' && account.isConnected
    );

    for (const account of paypalAccounts) {
      const today = new Date().toDateString();
      
      // Check if we already have a transaction for this PayPal balance today
      const existingTransaction = transactions.find(
        t => t.title.includes(`PayPal`) && 
            t.title.includes(account.name) &&
            t.date.toDateString() === today
      );

      if (!existingTransaction && account.balance !== 0) {
        if (account.balance < 0) {
          // Create expense transaction for negative balance
          const expenseTransaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `PayPal Ausgabe: ${account.name}`,
            amount: Math.abs(account.balance),
            type: 'expense',
            category: 'PayPal',
            date: new Date(),
            isRecurring: false,
            description: `Automatisch erstellt aus negativem PayPal-Saldo`,
          };

          await addTransaction(expenseTransaction);
          console.log('Created expense transaction for negative PayPal balance:', account.name);
        } else if (account.balance > 0) {
          // Create income transaction for positive balance
          const incomeTransaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
            title: `PayPal Einnahme: ${account.name}`,
            amount: account.balance,
            type: 'income',
            category: 'PayPal',
            date: new Date(),
            isRecurring: false,
            description: `Automatisch erstellt aus positivem PayPal-Saldo`,
          };

          await addTransaction(incomeTransaction);
          console.log('Created income transaction for positive PayPal balance:', account.name);
        }
      }
    }
  };
};
