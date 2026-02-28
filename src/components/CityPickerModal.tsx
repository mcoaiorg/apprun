import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';

import { City, ThemeMode } from '@/types';
import { palette } from '@/context/Theme';

interface Props {
  visible: boolean;
  cities: City[];
  onClose: () => void;
  onSelect: (cityId: string) => void;
  theme: ThemeMode;
}

export const CityPickerModal = ({ visible, cities, onClose, onSelect, theme }: Props) => {
  const [query, setQuery] = useState('');
  const colors = palette[theme];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cities;
    return cities.filter((city) => `${city.city} ${city.country}`.toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Add World Clock</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search city or country"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
        />
        <FlatList
          data={filtered}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item.id);
                setQuery('');
                onClose();
              }}
              style={[styles.item, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.city, { color: colors.text }]}>{item.city}</Text>
              <Text style={[styles.country, { color: colors.muted }]}>{item.country}</Text>
            </Pressable>
          )}
        />
        <Pressable onPress={onClose} style={[styles.close, { backgroundColor: colors.card }]}> 
          <Text style={{ color: colors.text, fontWeight: '700' }}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingTop: 70, paddingHorizontal: 18 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  item: { paddingVertical: 12, borderBottomWidth: 1 },
  city: { fontSize: 16, fontWeight: '700' },
  country: { fontSize: 12, marginTop: 2 },
  close: {
    marginVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
  },
});
