
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types/Transaction';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { defaultCategories } from '../data/categories';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
  onEdit,
  onDelete,
}) => {
  const category = defaultCategories.find(c => c.id === transaction.category);
  const isIncome = transaction.type === 'income';

  const formatAmount = (amount: number) => {
    return `${isIncome ? '+' : '-'}€${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRecurringText = () => {
    if (!transaction.isRecurring) return '';
    
    switch (transaction.recurringType) {
      case 'daily': return 'Täglich';
      case 'weekly': return 'Wöchentlich';
      case 'monthly': return 'Monatlich';
      case 'yearly': return 'Jährlich';
      case 'custom': return `Alle ${transaction.recurringInterval} Tage`;
      default: return '';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: category?.color || colors.textSecondary }]}>
            <Icon 
              name={category?.icon as any || 'cash'} 
              size={20} 
              color="white" 
            />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{transaction.title}</Text>
            <Text style={styles.category}>{category?.name || transaction.category}</Text>
            {transaction.isRecurring && (
              <Text style={styles.recurring}>{getRecurringText()}</Text>
            )}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={[
            styles.amount,
            { color: isIncome ? colors.success : colors.danger }
          ]}>
            {formatAmount(transaction.amount)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Icon name="create" size={16} color={colors.primary} />
          <Text style={styles.actionText}>Bearbeiten</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Icon name="trash" size={16} color={colors.danger} />
          <Text style={[styles.actionText, { color: colors.danger }]}>Löschen</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  recurring: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 6,
  },
});

export default TransactionCard;
