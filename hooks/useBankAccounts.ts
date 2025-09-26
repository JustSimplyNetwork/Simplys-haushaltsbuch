
import { useState, useEffect } from 'react';
import { BankAccount, BankSettings } from '../types/BankAccount';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BANK_SETTINGS_KEY = 'bank_settings';

export const useBankAccounts = () => {
  const [settings, setSettings] = useState<BankSettings>({
    enableBankSync: false,
    enablePayPalSync: false,
    accounts: [],
    autoSyncInterval: 'manual',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(BANK_SETTINGS_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsedSettings.accounts = parsedSettings.accounts.map((account: any) => ({
          ...account,
          lastSync: account.lastSync ? new Date(account.lastSync) : undefined,
        }));
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.log('Error loading bank settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: BankSettings) => {
    try {
      await AsyncStorage.setItem(BANK_SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving bank settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<BankSettings>) => {
    const updatedSettings = { ...settings, ...updates };
    await saveSettings(updatedSettings);
  };

  const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    const newAccount: BankAccount = {
      ...account,
      id: Date.now().toString(),
    };
    
    const updatedSettings = {
      ...settings,
      accounts: [...settings.accounts, newAccount],
    };
    await saveSettings(updatedSettings);
  };

  const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    const updatedSettings = {
      ...settings,
      accounts: settings.accounts.map(account => 
        account.id === id ? { ...account, ...updates } : account
      ),
    };
    await saveSettings(updatedSettings);
  };

  const removeAccount = async (id: string) => {
    const updatedSettings = {
      ...settings,
      accounts: settings.accounts.filter(account => account.id !== id),
    };
    await saveSettings(updatedSettings);
  };

  // Mock function to simulate fetching bank balance
  const syncAccountBalance = async (accountId: string): Promise<number> => {
    // In a real app, this would connect to bank APIs
    // For now, we'll simulate with random values
    const mockBalance = Math.random() * 2000 - 500; // Random balance between -500 and 1500
    
    await updateAccount(accountId, {
      balance: mockBalance,
      lastSync: new Date(),
      isConnected: true, // Mark as connected after first sync
    });
    
    return mockBalance;
  };

  const getTotalBalance = (): number => {
    return settings.accounts
      .filter(account => account.isConnected)
      .reduce((total, account) => total + account.balance, 0);
  };

  return {
    settings,
    loading,
    updateSettings,
    addAccount,
    updateAccount,
    removeAccount,
    syncAccountBalance,
    getTotalBalance,
  };
};
