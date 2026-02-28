import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Alarm, ThemeMode } from '@/types';
import { palette } from '@/context/Theme';

interface Props {
  alarm: Alarm;
  theme: ThemeMode;
  onToggle: (value: boolean) => void;
  onSnoozeCycle: () => void;
  onDelete: () => void;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmCard = ({ alarm, theme, onToggle, onSnoozeCycle, onDelete }: Props) => {
  const colors = palette[theme];
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}> 
      <View style={{ flex: 1 }}>
        <Text style={[styles.time, { color: colors.text }]}>
          {alarm.hour.toString().padStart(2, '0')}:{alarm.minute.toString().padStart(2, '0')}
        </Text>
        <Text style={[styles.label, { color: colors.muted }]}>{alarm.label || 'Alarm'}</Text>
        <Text style={[styles.days, { color: colors.muted }]}>
          {alarm.repeatDays.length ? alarm.repeatDays.map((d) => dayNames[d]).join(', ') : 'One-time'}
        </Text>
        <Pressable onPress={onSnoozeCycle}>
          <Text style={[styles.snooze, { color: colors.accent }]}>Snooze: {alarm.snoozeMinutes} min</Text>
        </Pressable>
      </View>
      <View style={styles.controls}>
        <Switch value={alarm.enabled} onValueChange={onToggle} />
        <Pressable onPress={onDelete}>
          <Text style={{ color: colors.danger, fontWeight: '700', marginTop: 16 }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
  },
  time: { fontSize: 32, fontWeight: '800' },
  label: { fontSize: 14, marginTop: 2 },
  days: { fontSize: 12, marginTop: 6 },
  snooze: { fontSize: 12, marginTop: 8 },
  controls: { justifyContent: 'space-between', alignItems: 'flex-end' },
});
