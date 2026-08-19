import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { EventItem, ACCENT_COLORS, AppSettings } from '../types';

interface SettingsModalProps {
  visible: boolean;
  events: EventItem[];
  settings: AppSettings;
  theme: any;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  events,
  settings,
  theme,
  onClose,
  onUpdateSettings,
}) => {
  // Compute event counts dynamically
  const totalEvents = events.length;
  const pontoCount = events.filter((e) => e.category === 'ponto').length;
  const criticoCount = events.filter((e) => e.category === 'critico').length;
  const reunioesCount = events.filter((e) => e.category === 'reunioes').length;
  const comunsCount = events.filter((e) => e.category === 'comuns').length;
  const programacaoCount = events.filter((e) => e.category === 'programacao').length;

  const categoryCards = [
    { label: 'Ponto', count: pontoCount, bg: '#FF453A', textColor: '#FFFFFF' },
    { label: 'Crítico', count: criticoCount, bg: '#FFD60A', textColor: '#000000' },
    { label: 'Reuniões', count: reunioesCount, bg: '#30D158', textColor: '#FFFFFF' },
    { label: 'Comuns', count: comunsCount, bg: '#0A84FF', textColor: '#FFFFFF' },
    { label: 'Programação', count: programacaoCount, bg: '#8E8E93', textColor: '#FFFFFF' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: theme.textMuted }]} />
          </View>

          {/* Header with Title and Close Button */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Configurações
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeIconText, { color: theme.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* APARÊNCIA */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
                APARÊNCIA
              </Text>

              {/* Modo escuro */}
              <View style={styles.settingRow}>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>
                  Modo escuro
                </Text>
                <Switch
                  value={settings.isDarkMode}
                  onValueChange={(val) => onUpdateSettings({ isDarkMode: val })}
                  trackColor={{
                    false: theme.isDarkMode ? '#3A3A3C' : '#D1D1D6',
                    true: theme.accent,
                  }}
                  thumbColor={'#FFFFFF'}
                />
              </View>

              {/* Cor de destaque */}
              <View style={styles.colorPickerSection}>
                <Text style={[styles.subLabel, { color: theme.textSecondary }]}>
                  Cor de destaque
                </Text>
                <View style={styles.colorPaletteRow}>
                  {ACCENT_COLORS.map((color) => {
                    const isSelected = settings.accentColor.toLowerCase() === color.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={color}
                        onPress={() => onUpdateSettings({ accentColor: color })}
                        activeOpacity={0.8}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          isSelected && styles.colorCircleSelected,
                        ]}
                      >
                        {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* ESTATÍSTICAS */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
                ESTATÍSTICAS
              </Text>

              {/* Big Total Card */}
              <View
                style={[
                  styles.totalStatsCard,
                  { backgroundColor: theme.cardSecondaryBg },
                ]}
              >
                <Text style={[styles.totalCountText, { color: theme.accent }]}>
                  {totalEvents}
                </Text>
                <Text style={[styles.totalLabelText, { color: theme.textSecondary }]}>
                  Total de eventos
                </Text>
              </View>

              {/* Category Breakdown Cards */}
              <View style={styles.categoryStatsRow}>
                {categoryCards.map((cat, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.categoryStatBox,
                      { backgroundColor: cat.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryStatCount,
                        { color: cat.textColor },
                      ]}
                    >
                      {cat.count}
                    </Text>
                    <Text
                      style={[
                        styles.categoryStatName,
                        { color: cat.textColor },
                      ]}
                      numberOfLines={2}
                    >
                      {cat.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* SOBRE */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
                SOBRE
              </Text>

              <View style={styles.aboutContainer}>
                <Text style={[styles.aboutAppName, { color: theme.textPrimary }]}>
                  Calendário
                </Text>
                <Text style={[styles.aboutVersion, { color: theme.textSecondary }]}>
                  Versão 1.0.0
                </Text>
                <Text style={[styles.aboutInspired, { color: theme.textMuted }]}>
                  Inspirado no Calendário Xiaomi HyperOS
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  closeBtn: {
    padding: 6,
  },
  closeIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  contentScroll: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  colorPickerSection: {
    marginTop: 14,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 14,
  },
  colorPaletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.08 }],
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  totalStatsCard: {
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  totalCountText: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  totalLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryStatsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  categoryStatBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  categoryStatCount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  categoryStatName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutAppName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  aboutInspired: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default SettingsModal;
