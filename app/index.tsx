
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useTransactions } from '../hooks/useTransactions';
import BudgetSummaryCard from '../components/BudgetSummaryCard';
import TransactionCard from '../components/TransactionCard';
import AddTransactionSheet from '../components/AddTransactionSheet';
import Icon from '../components/Icon';
import { Transaction } from '../types/Transaction';

export default function MainScreen() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction, getBudgetSummary } = useTransactions();
  const [isAddSheetVisible, setIsAddSheetVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const budgetSummary = getBudgetSummary();
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTransaction(transaction);
      console.log('Transaction added successfully');
    } catch (error) {
      console.log('Error adding transaction:', error);
      Alert.alert('Fehler', 'Fehler beim Hinzufügen des Eintrags');
    }
  };

  const handleEditTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;
    
    try {
      await updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(undefined);
      console.log('Transaction updated successfully');
    } catch (error) {
      console.log('Error updating transaction:', error);
      Alert.alert('Fehler', 'Fehler beim Aktualisieren des Eintrags');
    }
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    Alert.alert(
      'Eintrag löschen',
      `Möchten Sie "${transaction.title}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
              console.log('Transaction deleted successfully');
            } catch (error) {
              console.log('Error deleting transaction:', error);
              Alert.alert('Fehler', 'Fehler beim Löschen des Eintrags');
            }
          },
        },
      ]
    );
  };

  const openEditSheet = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddSheetVisible(true);
  };

  const closeSheet = () => {
    setIsAddSheetVisible(false);
    setEditingTransaction(undefined);
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={commonStyles.text}>Lade Daten...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Haushaltsbuch</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddSheetVisible(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Budget Summary */}
        <BudgetSummaryCard summary={budgetSummary} />

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={commonStyles.subtitle}>Letzte Einträge</Text>
            {transactions.length > 10 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Alle anzeigen</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>Keine Einträge vorhanden</Text>
              <Text style={styles.emptyStateText}>
                Fügen Sie Ihren ersten Eintrag hinzu, um zu beginnen.
              </Text>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.emptyStateButton]}
                onPress={() => setIsAddSheetVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Ersten Eintrag hinzufügen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => console.log('Transaction pressed:', transaction.title)}
                onEdit={() => openEditSheet(transaction)}
                onDelete={() => handleDeleteTransaction(transaction)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddSheetVisible(true)}
      >
        <Icon name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Transaction Sheet */}
      <AddTransactionSheet
        isVisible={isAddSheetVisible}
        onClose={closeSheet}
        onSave={editingTransaction ? handleEditTransaction : handleAddTransaction}
        editTransaction={editingTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.primary}40`,
    elevation: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 6px 16px ${colors.primary}40`,
    elevation: 6,
  },
});
