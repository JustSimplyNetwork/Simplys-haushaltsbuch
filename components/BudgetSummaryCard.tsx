
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetSummary } from '../types/Transaction';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { useBankAccounts } from '../hooks/useBankAccounts';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ summary }) => {
  const { getTotalBalance, settings } = useBankAccounts();
  
  const formatAmount = (amount: number) => {
    return `€${Math.abs(amount).toFixed(2)}`;
  };

  const totalAccountBalance = getTotalBalance();
  const overallBalance = summary.balance + totalAccountBalance;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Übersicht</Text>
      
      {/* Main Balance Display */}
      <View style={styles.mainBalanceContainer}>
        <View style={styles.balanceRow}>
          {/* Monthly Balance - Small */}
          <View style={styles.monthlyBalanceContainer}>
            <Text style={styles.monthlyBalanceLabel}>Monat</Text>
            <View style={styles.monthlyBalanceAmount}>
              <Icon 
                name={summary.monthlyBalance >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={summary.monthlyBalance >= 0 ? colors.success : colors.danger} 
              />
              <Text style={[
                styles.monthlyBalanceText,
                { color: summary.monthlyBalance >= 0 ? colors.success : colors.danger }
              ]}>
                {summary.monthlyBalance >= 0 ? '+' : '-'}{formatAmount(summary.monthlyBalance)}
              </Text>
            </View>
          </View>

          {/* Total Balance - Prominent */}
          <View style={styles.totalBalanceContainer}>
            <Text style={styles.totalBalanceLabel}>Gesamtsaldo</Text>
            <Text style={[
              styles.totalBalanceAmount,
              { color: overallBalance >= 0 ? colors.success : colors.danger }
            ]}>
              {overallBalance >= 0 ? '+' : '-'}{formatAmount(overallBalance)}
            </Text>
          </View>
        </View>
      </View>

      {/* Income/Expense Summary */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryItem, styles.incomeItem]}>
          <Icon name="trending-up" size={20} color={colors.success} />
          <Text style={styles.summaryLabel}>Einnahmen</Text>
          <Text style={[styles.summaryAmount, { color: colors.success }]}>
            {formatAmount(summary.monthlyIncome)}
          </Text>
        </View>
        
        <View style={[styles.summaryItem, styles.expenseItem]}>
          <Icon name="trending-down" size={20} color={colors.danger} />
          <Text style={styles.summaryLabel}>Ausgaben</Text>
          <Text style={[styles.summaryAmount, { color: colors.danger }]}>
            {formatAmount(summary.monthlyExpenses)}
          </Text>
        </View>
      </View>

      {/* Bank Account Info */}
      {(settings.enableBankSync || settings.enablePayPalSync) && settings.accounts.length > 0 && (
        <View style={styles.bankAccountsContainer}>
          <Text style={styles.bankAccountsTitle}>Verbundene Konten</Text>
          <View style={styles.bankAccountsList}>
            {settings.accounts
              .filter(account => account.isConnected)
              .map((account) => (
                <View key={account.id} style={styles.bankAccountItem}>
                  <Icon
                    name={account.type === 'paypal' ? 'logo-paypal' : 'card'}
                    size={16}
                    color={account.type === 'paypal' ? '#0070ba' : colors.primary}
                  />
                  <Text style={styles.bankAccountName}>{account.name}</Text>
                  <Text style={[
                    styles.bankAccountBalance,
                    { color: account.balance >= 0 ? colors.success : colors.danger }
                  ]}>
                    {account.balance >= 0 ? '+' : '-'}{formatAmount(account.balance)}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  mainBalanceContainer: {
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthlyBalanceContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  monthlyBalanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  monthlyBalanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthlyBalanceText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  totalBalanceContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  totalBalanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  incomeItem: {
    backgroundColor: colors.success + '10',
  },
  expenseItem: {
    backgroundColor: colors.danger + '10',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  bankAccountsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bankAccountsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bankAccountsList: {
    gap: 8,
  },
  bankAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  bankAccountName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  bankAccountBalance: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BudgetSummaryCard;
