
export interface BankAccount {
  id: string;
  name: string;
  type: 'bank' | 'paypal';
  balance: number;
  isConnected: boolean;
  lastSync?: Date;
}

export interface BankSettings {
  enableBankSync: boolean;
  enablePayPalSync: boolean;
  accounts: BankAccount[];
  autoSyncInterval: 'manual' | 'daily' | 'weekly';
}
