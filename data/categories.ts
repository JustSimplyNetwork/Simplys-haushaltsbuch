
import { TransactionCategory } from '../types/Transaction';

export const defaultCategories: TransactionCategory[] = [
  // Income categories
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
    id: 'other-income',
    name: 'Sonstiges',
    type: 'income',
    color: '#0891b2',
    icon: 'cash',
  },
  
  // Expense categories
  {
    id: 'housing',
    name: 'Wohnen',
    type: 'expense',
    color: '#ef4444',
    icon: 'home',
  },
  {
    id: 'food',
    name: 'Lebensmittel',
    type: 'expense',
    color: '#f97316',
    icon: 'restaurant',
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    color: '#eab308',
    icon: 'car',
  },
  {
    id: 'utilities',
    name: 'Nebenkosten',
    type: 'expense',
    color: '#8b5cf6',
    icon: 'flash',
  },
  {
    id: 'entertainment',
    name: 'Unterhaltung',
    type: 'expense',
    color: '#ec4899',
    icon: 'game-controller',
  },
  {
    id: 'healthcare',
    name: 'Gesundheit',
    type: 'expense',
    color: '#06b6d4',
    icon: 'medical',
  },
  {
    id: 'shopping',
    name: 'Einkaufen',
    type: 'expense',
    color: '#84cc16',
    icon: 'bag',
  },
  {
    id: 'other-expense',
    name: 'Sonstiges',
    type: 'expense',
    color: '#6b7280',
    icon: 'ellipsis-horizontal',
  },
];
