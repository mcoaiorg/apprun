import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useApp } from '@/context/AppContext';
import { palette } from '@/context/Theme';

export const SettingsScreen = () => {
  const { settings, setSettings } = useApp();
  const colors = palette[settings.theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}> 
        <Item label="24-Hour Time" value={<Switch value={settings.use24Hour} onValueChange={(v) => setSettings({ use24Hour: v })} />} textColor={colors.text} />
        <Item
          label="Theme"
          value={
            <Pressable onPress={() => setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>
              <Text style={{ color: colors.accent, fontWeight: '700', textTransform: 'capitalize' }}>{settings.theme}</Text>
            </Pressable>
          }
          textColor={colors.text}
        />
        <Item
          label="Default Snooze"
          value={
            <Pressable
              onPress={() =>
                setSettings({
                  defaultSnooze: settings.defaultSnooze === 5 ? 10 : settings.defaultSnooze === 10 ? 15 : 5,
                })
              }
            >
              <Text style={{ color: colors.accent, fontWeight: '700' }}>{settings.defaultSnooze} min</Text>
            </Pressable>
          }
          textColor={colors.text}
        />
        <Item
          label="Auto-detect Timezone"
          value={<Switch value={settings.autoDetectTimezone} onValueChange={(v) => setSettings({ autoDetectTimezone: v })} />}
          textColor={colors.text}
        />
      </View>
    </View>
  );
};

const Item = ({ label, value, textColor }: { label: string; value: React.ReactNode; textColor: string }) => (
  <View style={styles.row}>
    <Text style={{ color: textColor, fontSize: 16 }}>{label}</Text>
    {value}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingHorizontal: 16 },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 14 },
  card: { borderRadius: 18, padding: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
});
