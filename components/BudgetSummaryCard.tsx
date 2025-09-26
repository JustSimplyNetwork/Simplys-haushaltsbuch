
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BudgetSummary } from '../types/Transaction';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ summary }) => {
  const formatAmount = (amount: number) => {
    return `€${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Übersicht</Text>
      
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryItem, styles.incomeItem]}>
          <Icon name="trending-up" size={24} color={colors.success} />
          <Text style={styles.summaryLabel}>Einnahmen</Text>
          <Text style={[styles.summaryAmount, { color: colors.success }]}>
            {formatAmount(summary.monthlyIncome)}
          </Text>
        </View>
        
        <View style={[styles.summaryItem, styles.expenseItem]}>
          <Icon name="trending-down" size={24} color={colors.danger} />
          <Text style={styles.summaryLabel}>Ausgaben</Text>
          <Text style={[styles.summaryAmount, { color: colors.danger }]}>
            {formatAmount(summary.monthlyExpenses)}
          </Text>
        </View>
      </View>
      
      <View style={[
        styles.balanceContainer,
        { backgroundColor: summary.monthlyBalance >= 0 ? colors.success + '10' : colors.danger + '10' }
      ]}>
        <Icon 
          name={summary.monthlyBalance >= 0 ? "checkmark-circle" : "alert-circle"} 
          size={28} 
          color={summary.monthlyBalance >= 0 ? colors.success : colors.danger} 
        />
        <View style={styles.balanceText}>
          <Text style={styles.balanceLabel}>Monatlicher Saldo</Text>
          <Text style={[
            styles.balanceAmount,
            { color: summary.monthlyBalance >= 0 ? colors.success : colors.danger }
          ]}>
            {summary.monthlyBalance >= 0 ? '+' : '-'}{formatAmount(summary.monthlyBalance)}
          </Text>
        </View>
      </View>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  incomeItem: {
    backgroundColor: colors.success + '10',
  },
  expenseItem: {
    backgroundColor: colors.danger + '10',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  balanceText: {
    marginLeft: 12,
    flex: 1,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
});

export default BudgetSummaryCard;
