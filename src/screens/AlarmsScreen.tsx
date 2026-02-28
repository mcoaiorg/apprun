import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AlarmCard } from '@/components/AlarmCard';
import { useApp } from '@/context/AppContext';
import { palette } from '@/context/Theme';

const nextSnooze = (current: 5 | 10 | 15): 5 | 10 | 15 => (current === 5 ? 10 : current === 10 ? 15 : 5);

export const AlarmsScreen = () => {
  const { alarms, addAlarm, updateAlarm, removeAlarm, settings } = useApp();
  const colors = palette[settings.theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headRow}>
        <Text style={[styles.title, { color: colors.text }]}>Alarms</Text>
        <Pressable
          onPress={() => addAlarm({ hour: 7, minute: 0, label: `Alarm ${alarms.length + 1}`, snoozeMinutes: settings.defaultSnooze })}
          style={[styles.addBtn, { backgroundColor: colors.accent }]}
        >
          <MaterialCommunityIcons name="plus" color="#fff" size={20} />
          <Text style={styles.addTxt}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={alarms}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No alarms yet. Tap Add.</Text>}
        renderItem={({ item }) => (
          <AlarmCard
            alarm={item}
            theme={settings.theme}
            onToggle={(enabled) => updateAlarm(item.id, { enabled })}
            onSnoozeCycle={() => updateAlarm(item.id, { snoozeMinutes: nextSnooze(item.snoozeMinutes) })}
            onDelete={() => removeAlarm(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 16 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '800' },
  addBtn: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  addTxt: { color: '#fff', fontWeight: '700', marginLeft: 4 },
});
