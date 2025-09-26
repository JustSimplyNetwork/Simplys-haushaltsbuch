
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import SimpleBottomSheet from './BottomSheet';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { useBankAccounts } from '../hooks/useBankAccounts';
import { BankAccount } from '../types/BankAccount';

interface BankSettingsSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const BankSettingsSheet: React.FC<BankSettingsSheetProps> = ({ isVisible, onClose }) => {
  const { settings, updateSettings, addAccount, removeAccount, syncAccountBalance } = useBankAccounts();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'bank' | 'paypal'>('bank');

  const handleToggleBankSync = (value: boolean) => {
    updateSettings({ enableBankSync: value });
  };

  const handleTogglePayPalSync = (value: boolean) => {
    updateSettings({ enablePayPalSync: value });
  };

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Kontonamen ein.');
      return;
    }

    await addAccount({
      name: newAccountName.trim(),
      type: newAccountType,
      balance: 0,
      isConnected: false,
    });

    setNewAccountName('');
    setShowAddAccount(false);
    Alert.alert('Erfolg', 'Konto wurde hinzugefügt.');
  };

  const handleRemoveAccount = (account: BankAccount) => {
    Alert.alert(
      'Konto entfernen',
      `Möchten Sie "${account.name}" wirklich entfernen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: () => removeAccount(account.id),
        },
      ]
    );
  };

  const handleSyncAccount = async (account: BankAccount) => {
    try {
      Alert.alert('Synchronisation', 'Kontodaten werden abgerufen...');
      await syncAccountBalance(account.id);
      Alert.alert('Erfolg', 'Kontodaten wurden aktualisiert.');
    } catch (error) {
      console.log('Error syncing account:', error);
      Alert.alert('Fehler', 'Fehler beim Abrufen der Kontodaten.');
    }
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Kontoverbindungen</Text>
        <Text style={styles.subtitle}>
          Verbinden Sie Ihre Bank- und PayPal-Konten für automatische Saldoabfragen.
        </Text>

        {/* Bank Sync Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="card" size={24} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Bankkonto-Synchronisation</Text>
              <Text style={styles.settingDescription}>
                Automatisches Abrufen von Kontodaten
              </Text>
            </View>
          </View>
          <Switch
            value={settings.enableBankSync}
            onValueChange={handleToggleBankSync}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={settings.enableBankSync ? colors.primary : colors.textSecondary}
          />
        </View>

        {/* PayPal Sync Toggle */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="logo-paypal" size={24} color="#0070ba" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>PayPal-Synchronisation</Text>
              <Text style={styles.settingDescription}>
                Automatisches Abrufen von PayPal-Saldo
              </Text>
            </View>
          </View>
          <Switch
            value={settings.enablePayPalSync}
            onValueChange={handleTogglePayPalSync}
            trackColor={{ false: colors.border, true: '#0070ba40' }}
            thumbColor={settings.enablePayPalSync ? '#0070ba' : colors.textSecondary}
          />
        </View>

        {/* Connected Accounts */}
        {(settings.enableBankSync || settings.enablePayPalSync) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Verbundene Konten</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddAccount(true)}
              >
                <Icon name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {settings.accounts.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="wallet-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>Keine Konten verbunden</Text>
              </View>
            ) : (
              settings.accounts.map((account) => (
                <View key={account.id} style={styles.accountItem}>
                  <View style={styles.accountInfo}>
                    <Icon
                      name={account.type === 'paypal' ? 'logo-paypal' : 'card'}
                      size={24}
                      color={account.type === 'paypal' ? '#0070ba' : colors.primary}
                    />
                    <View style={styles.accountText}>
                      <Text style={styles.accountName}>{account.name}</Text>
                      <Text style={styles.accountBalance}>
                        €{account.balance.toFixed(2)}
                      </Text>
                      {account.lastSync && (
                        <Text style={styles.lastSync}>
                          Zuletzt: {account.lastSync.toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.accountActions}>
                    <TouchableOpacity
                      style={styles.syncButton}
                      onPress={() => handleSyncAccount(account)}
                    >
                      <Icon name="refresh" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveAccount(account)}
                    >
                      <Icon name="trash" size={16} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Add Account Form */}
        {showAddAccount && (
          <View style={styles.addAccountForm}>
            <Text style={styles.formTitle}>Neues Konto hinzufügen</Text>
            
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newAccountType === 'bank' && styles.typeButtonActive,
                ]}
                onPress={() => setNewAccountType('bank')}
              >
                <Icon name="card" size={20} color={newAccountType === 'bank' ? 'white' : colors.primary} />
                <Text style={[
                  styles.typeButtonText,
                  newAccountType === 'bank' && styles.typeButtonTextActive,
                ]}>
                  Bank
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newAccountType === 'paypal' && styles.typeButtonActive,
                ]}
                onPress={() => setNewAccountType('paypal')}
              >
                <Icon name="logo-paypal" size={20} color={newAccountType === 'paypal' ? 'white' : '#0070ba'} />
                <Text style={[
                  styles.typeButtonText,
                  newAccountType === 'paypal' && styles.typeButtonTextActive,
                ]}>
                  PayPal
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Kontoname eingeben"
              value={newAccountName}
              onChangeText={setNewAccountName}
              placeholderTextColor={colors.textSecondary}
            />

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[buttonStyles.secondary, styles.formButton]}
                onPress={() => {
                  setShowAddAccount(false);
                  setNewAccountName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.primary, styles.formButton]}
                onPress={handleAddAccount}
              >
                <Text style={styles.addButtonText}>Hinzufügen</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Icon name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            Die Kontoverbindung ist optional und dient nur zur automatischen Saldoabfrage. 
            Ihre Daten werden sicher und lokal gespeichert.
          </Text>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountText: {
    marginLeft: 12,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
    marginBottom: 2,
  },
  lastSync: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.danger + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAccountForm: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default BankSettingsSheet;
