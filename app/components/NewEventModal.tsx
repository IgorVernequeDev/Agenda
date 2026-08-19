import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  CategoryType,
  CATEGORIES,
  EventItem,
  RecurrenceType,
  RECURRENCE_OPTIONS,
} from '../types';
import { formatDisplayDate, parseDisplayDate } from '../utils/dateUtils';

interface NewEventModalProps {
  visible: boolean;
  selectedDate: string; // YYYY-MM-DD
  theme: any;
  onClose: () => void;
  onSave: (eventData: Omit<EventItem, 'id' | 'createdAt'>) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  visible,
  selectedDate,
  theme,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [category, setCategory] = useState<CategoryType>('comuns');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (visible) {
      setTitle('');
      setDescription('');
      setDateInput(formatDisplayDate(selectedDate));
      setCategory('comuns');
      setRecurrence('none');
      setIsAllDay(false);
      setStartTime('09:00');
      setEndTime('10:00');
    }
  }, [visible, selectedDate]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o título do evento.');
      return;
    }

    const isoDate = parseDisplayDate(dateInput);
    if (!isoDate) {
      Alert.alert('Data inválida', 'Por favor, informe a data no formato DD/MM/AAAA.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      date: isoDate,
      category,
      recurrence,
      isAllDay,
      startTime: isAllDay ? undefined : startTime.trim() || '09:00',
      endTime: isAllDay ? undefined : endTime.trim() || '10:00',
      completedDates: [],
    });

    onClose();
  };

  const categoryList: CategoryType[] = [
    'ponto',
    'critico',
    'reunioes',
    'comuns',
    'programacao',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          {/* Header Bar: Cancelar | Novo Evento | Salvar */}
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.headerBtn}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Novo Evento</Text>

            <TouchableOpacity onPress={handleSave} activeOpacity={0.7} style={styles.headerBtn}>
              <Text style={[styles.saveText, { color: theme.accent }]}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* TÍTULO */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>TÍTULO</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="Título do evento"
                placeholderTextColor={theme.isDarkMode ? '#555558' : '#8E8E93'}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            {/* DESCRIÇÃO */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>DESCRIÇÃO</Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="Descrição opcional"
                placeholderTextColor={theme.isDarkMode ? '#555558' : '#8E8E93'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* DATA */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>DATA DE INÍCIO</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.inputBg,
                    color: theme.textPrimary,
                  },
                ]}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={theme.isDarkMode ? '#555558' : '#8E8E93'}
                value={dateInput}
                onChangeText={setDateInput}
                keyboardType="numbers-and-punctuation"
              />
            </View>

            {/* REPETIÇÃO (Novo) */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>REPETIÇÃO</Text>
              <View style={styles.recurrenceRow}>
                {RECURRENCE_OPTIONS.map((opt) => {
                  const isSelected = recurrence === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => setRecurrence(opt.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.recurrenceChip,
                        {
                          backgroundColor: isSelected
                            ? theme.isDarkMode
                              ? 'rgba(0, 122, 255, 0.15)'
                              : 'rgba(0, 122, 255, 0.1)'
                            : theme.inputBg,
                          borderColor: isSelected ? theme.accent : 'transparent',
                          borderWidth: isSelected ? 1.5 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.chipEmoji}>{opt.icon}</Text>
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? theme.accent : theme.textPrimary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* CATEGORIA */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>CATEGORIA</Text>
              <View style={styles.categoryChipsContainer}>
                {categoryList.map((catKey) => {
                  const cat = CATEGORIES[catKey];
                  const isSelected = category === catKey;

                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => setCategory(catKey)}
                      activeOpacity={0.7}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected
                            ? theme.isDarkMode
                              ? 'rgba(0, 122, 255, 0.15)'
                              : 'rgba(0, 122, 255, 0.1)'
                            : theme.inputBg,
                          borderColor: isSelected ? theme.accent : 'transparent',
                          borderWidth: isSelected ? 1.5 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? theme.accent : theme.textPrimary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Dia inteiro switch */}
            <View
              style={[
                styles.switchCard,
                { backgroundColor: theme.inputBg },
              ]}
            >
              <Text style={[styles.switchLabel, { color: theme.textPrimary }]}>Dia inteiro</Text>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{
                  false: theme.isDarkMode ? '#3A3A3C' : '#D1D1D6',
                  true: theme.accent,
                }}
                thumbColor={'#FFFFFF'}
              />
            </View>

            {/* HORÁRIO (Start and End) */}
            {!isAllDay && (
              <View style={styles.formGroup}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>HORÁRIO</Text>
                <View style={styles.timeInputsRow}>
                  <View style={styles.timeInputWrapper}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                        },
                      ]}
                      placeholder="09:00"
                      placeholderTextColor={theme.isDarkMode ? '#555558' : '#8E8E93'}
                      value={startTime}
                      onChangeText={setStartTime}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>

                  <View style={styles.timeInputWrapper}>
                    <TextInput
                      style={[
                        styles.timeInput,
                        {
                          backgroundColor: theme.inputBg,
                          color: theme.textPrimary,
                        },
                      ]}
                      placeholder="10:00"
                      placeholderTextColor={theme.isDarkMode ? '#555558' : '#8E8E93'}
                      value={endTime}
                      onChangeText={setEndTime}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '400',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textInput: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  recurrenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recurrenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 18,
    gap: 5,
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInputWrapper: {
    flex: 1,
  },
  timeInput: {
    height: 52,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewEventModal;
