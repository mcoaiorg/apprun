import React, { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ClockCard } from '@/components/ClockCard';
import { CityPickerModal } from '@/components/CityPickerModal';
import { useApp } from '@/context/AppContext';
import { useNow } from '@/hooks/useNow';
import { palette } from '@/context/Theme';
import { formatTime, getLocalTimeZone } from '@/utils/time';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const WorldClockScreen = () => {
  const { clocks, cities, addClock, removeClock, reorderClocks, settings, setSettings } = useApp();
  const [pickerVisible, setPickerVisible] = useState(false);
  const now = useNow();
  const colors = palette[settings.theme];
  const localTimeZone = getLocalTimeZone();

  const clockRows = useMemo(
    () => clocks.map((clock) => ({ ...clock, city: cities.find((c) => c.id === clock.cityId) })).filter((c) => c.city),
    [clocks, cities],
  );

  const renderRightActions = (id: string) => (
    <Pressable
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        removeClock(id);
      }}
      style={[styles.delete, { backgroundColor: colors.danger }]}
    >
      <MaterialCommunityIcons name="trash-can-outline" size={20} color="#fff" />
    </Pressable>
  );

  const renderItem = ({ item, drag, isActive }: RenderItemParams<(typeof clockRows)[number]>) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <Pressable onLongPress={drag} disabled={isActive}>
        <ClockCard
          city={item.city!}
          now={now}
          localTimeZone={localTimeZone}
          use24Hour={settings.use24Hour}
          theme={settings.theme}
        />
      </Pressable>
    </Swipeable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Local Time</Text>
          <Text style={[styles.localTime, { color: colors.text }]}>{formatTime(now, localTimeZone, settings.use24Hour)}</Text>
          <Text style={[styles.zone, { color: colors.muted }]}>{localTimeZone}</Text>
        </View>
        <Pressable style={styles.themeBtn} onPress={() => setSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}>
          <MaterialCommunityIcons
            name={settings.theme === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
            size={22}
            color={colors.text}
          />
        </Pressable>
      </View>

      <DraggableFlatList
        data={clockRows}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => reorderClocks(data.map(({ id, cityId }) => ({ id, cityId })))}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <Pressable onPress={() => setPickerVisible(true)} style={[styles.fab, { backgroundColor: colors.accent }]}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </Pressable>
      <CityPickerModal
        visible={pickerVisible}
        cities={cities}
        onClose={() => setPickerVisible(false)}
        onSelect={(cityId) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          addClock(cityId);
        }}
        theme={settings.theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 56 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '700' },
  localTime: { fontSize: 34, fontWeight: '800' },
  zone: { fontSize: 12 },
  themeBtn: { alignSelf: 'flex-start', padding: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  delete: {
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
