
import { TransactionCategory } from '../types/Transaction';

export const defaultCategories: TransactionCategory[] = [
  // Income Categories
  {
    id: 'salary',
    name: 'Gehalt',
    type: 'income',
    color: '#10b981',
    icon: 'briefcase',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    color: '#059669',
    icon: 'laptop',
  },
  {
    id: 'investment',
    name: 'Investitionen',
    type: 'income',
    color: '#0d9488',
    icon: 'trending-up',
  },
  {
    id: 'gift',
    name: 'Geschenk',
    type: 'income',
    color: '#0891b2',
    icon: 'gift',
  },
  {
    id: 'paypal_income',
    name: 'PayPal',
    type: 'income',
    color: '#0070ba',
    icon: 'logo-paypal',
  },
  {
    id: 'other_income',
    name: 'Sonstiges',
    type: 'income',
    color: '#6366f1',
    icon: 'add-circle',
  },

  // Expense Categories
  {
    id: 'food',
    name: 'Lebensmittel',
    type: 'expense',
    color: '#ef4444',
    icon: 'restaurant',
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    color: '#f97316',
    icon: 'car',
  },
  {
    id: 'housing',
    name: 'Wohnen',
    type: 'expense',
    color: '#eab308',
    icon: 'home',
  },
  {
    id: 'utilities',
    name: 'Nebenkosten',
    type: 'expense',
    color: '#84cc16',
    icon: 'flash',
  },
  {
    id: 'entertainment',
    name: 'Unterhaltung',
    type: 'expense',
    color: '#06b6d4',
    icon: 'game-controller',
  },
  {
    id: 'healthcare',
    name: 'Gesundheit',
    type: 'expense',
    color: '#8b5cf6',
    icon: 'medical',
  },
  {
    id: 'shopping',
    name: 'Einkaufen',
    type: 'expense',
    color: '#ec4899',
    icon: 'bag',
  },
  {
    id: 'education',
    name: 'Bildung',
    type: 'expense',
    color: '#f43f5e',
    icon: 'school',
  },
  {
    id: 'paypal_expense',
    name: 'PayPal',
    type: 'expense',
    color: '#0070ba',
    icon: 'logo-paypal',
  },
  {
    id: 'other_expense',
    name: 'Sonstiges',
    type: 'expense',
    color: '#64748b',
    icon: 'ellipsis-horizontal',
  },
];
