
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { Transaction } from '../types/Transaction';
import { defaultCategories } from '../data/categories';
import Icon from './Icon';
import SimpleBottomSheet from './BottomSheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface AddTransactionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTransaction?: Transaction;
}

const AddTransactionSheet: React.FC<AddTransactionSheetProps> = ({
  isVisible,
  onClose,
  onSave,
  editTransaction,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [recurringInterval, setRecurringInterval] = useState('1');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (editTransaction) {
      setTitle(editTransaction.title);
      setAmount(editTransaction.amount.toString());
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setDescription(editTransaction.description || '');
      setDate(editTransaction.date);
      setIsRecurring(editTransaction.isRecurring);
      setRecurringType(editTransaction.recurringType || 'monthly');
      setRecurringInterval(editTransaction.recurringInterval?.toString() || '1');
    } else {
      resetForm();
    }
  }, [editTransaction, isVisible]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDescription('');
    setDate(new Date());
    setIsRecurring(false);
    setRecurringType('monthly');
    setRecurringInterval('1');
  };

  const handleSave = () => {
    if (!title.trim() || !amount.trim() || !category) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Fehler', 'Bitte geben Sie einen gültigen Betrag ein.');
      return;
    }

    const transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date,
      isRecurring,
      recurringType: isRecurring ? recurringType : undefined,
      recurringInterval: isRecurring && recurringType === 'custom' ? parseInt(recurringInterval) : undefined,
      description: description.trim() || undefined,
    };

    onSave(transaction);
    onClose();
    if (!editTransaction) {
      resetForm();
    }
  };

  const filteredCategories = defaultCategories.filter(cat => cat.type === type);

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {editTransaction ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
        </Text>

        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Typ</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'income' && styles.typeButtonActive,
                { backgroundColor: type === 'income' ? colors.success : colors.backgroundAlt }
              ]}
              onPress={() => {
                setType('income');
                setCategory('');
              }}
            >
              <Icon name="trending-up" size={20} color={type === 'income' ? 'white' : colors.success} />
              <Text style={[
                styles.typeButtonText,
                { color: type === 'income' ? 'white' : colors.success }
              ]}>
                Einnahme
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'expense' && styles.typeButtonActive,
                { backgroundColor: type === 'expense' ? colors.danger : colors.backgroundAlt }
              ]}
              onPress={() => {
                setType('expense');
                setCategory('');
              }}
            >
              <Icon name="trending-down" size={20} color={type === 'expense' ? 'white' : colors.danger} />
              <Text style={[
                styles.typeButtonText,
                { color: type === 'expense' ? 'white' : colors.danger }
              ]}>
                Ausgabe
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Titel *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="z.B. Gehalt, Miete, Einkaufen..."
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Betrag * (€)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Kategorie *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonActive,
                  { borderColor: cat.color }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Icon name={cat.icon as any} size={20} color={category === cat.id ? 'white' : cat.color} />
                <Text style={[
                  styles.categoryButtonText,
                  { color: category === cat.id ? 'white' : cat.color }
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Datum</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('de-DE')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Recurring */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.recurringToggle}
            onPress={() => setIsRecurring(!isRecurring)}
          >
            <Icon 
              name={isRecurring ? "checkbox" : "square-outline"} 
              size={24} 
              color={isRecurring ? colors.primary : colors.textSecondary} 
            />
            <Text style={styles.recurringToggleText}>Wiederkehrend</Text>
          </TouchableOpacity>

          {isRecurring && (
            <View style={styles.recurringOptions}>
              <Text style={styles.sublabel}>Wiederholung</Text>
              <View style={styles.recurringTypeContainer}>
                {[
                  { key: 'daily', label: 'Täglich' },
                  { key: 'weekly', label: 'Wöchentlich' },
                  { key: 'monthly', label: 'Monatlich' },
                  { key: 'yearly', label: 'Jährlich' },
                  { key: 'custom', label: 'Benutzerdefiniert' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.recurringTypeButton,
                      recurringType === option.key && styles.recurringTypeButtonActive
                    ]}
                    onPress={() => setRecurringType(option.key as any)}
                  >
                    <Text style={[
                      styles.recurringTypeButtonText,
                      recurringType === option.key && styles.recurringTypeButtonTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {recurringType === 'custom' && (
                <View style={styles.customIntervalContainer}>
                  <Text style={styles.sublabel}>Alle</Text>
                  <TextInput
                    style={[styles.input, styles.intervalInput]}
                    value={recurringInterval}
                    onChangeText={setRecurringInterval}
                    placeholder="1"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                  />
                  <Text style={styles.sublabel}>Tage</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Beschreibung (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Zusätzliche Notizen..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[buttonStyles.secondary, styles.cancelButton]} onPress={onClose}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Abbrechen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[buttonStyles.primary, styles.saveButton]} onPress={handleSave}>
            <Text style={[styles.buttonText, { color: 'white' }]}>
              {editTransaction ? 'Aktualisieren' : 'Speichern'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recurringToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  recurringOptions: {
    marginTop: 8,
  },
  recurringTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  recurringTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  recurringTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  recurringTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  recurringTypeButtonTextActive: {
    color: 'white',
  },
  customIntervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intervalInput: {
    width: 80,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddTransactionSheet;
