import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { City, ThemeMode } from '@/types';
import { formatTime, getOffsetDifference, getTimeZoneOffsetLabel, isDayTime } from '@/utils/time';
import { palette } from '@/context/Theme';

interface Props {
  city: City;
  now: Date;
  localTimeZone: string;
  use24Hour: boolean;
  theme: ThemeMode;
}

export const ClockCard = ({ city, now, localTimeZone, use24Hour, theme }: Props) => {
  const colors = palette[theme];
  const day = isDayTime(now, city.timeZone);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: '#000' }]}> 
      <View>
        <Text style={[styles.city, { color: colors.text }]}>{city.city}</Text>
        <Text style={[styles.country, { color: colors.muted }]}>{city.country}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: colors.text }]}>{formatTime(now, city.timeZone, use24Hour)}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {getTimeZoneOffsetLabel(city.timeZone)} • {getOffsetDifference(city.timeZone, localTimeZone, now)}
        </Text>
        <View style={styles.dayRow}>
          <MaterialCommunityIcons
            name={day ? 'weather-sunny' : 'weather-night'}
            size={16}
            color={day ? '#FDB813' : colors.muted}
          />
          <Text style={[styles.meta, { color: colors.muted, marginLeft: 6 }]}>{day ? 'Day' : 'Night'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  city: { fontSize: 18, fontWeight: '700' },
  country: { fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  time: { fontSize: 24, fontWeight: '800' },
  meta: { fontSize: 12 },
  dayRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});
