import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, List } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { getRXGuideMeds, getAllMeds } from '@care/shared';

export default function MedicationSuggestions({ name, onNameChange, onSelect }) {
  const theme = useTheme();
  const [rxGuide, setRxGuide] = useState([]);
  const [userMeds, setUserMeds] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getRXGuideMeds().then(setRxGuide).catch(() => {});
    getAllMeds().then((m) => setUserMeds(m || [])).catch(() => {});
  }, []);

  const handleChange = (text) => {
    onNameChange(text);
    if (text.length > 0) {
      const query = text.toLowerCase();
      const rxMatches = rxGuide.filter((m) =>
        m.fields.name?.toLowerCase().includes(query)
      );
      const seen = new Set(rxMatches.map((m) => m.fields.name?.toLowerCase()));
      const userMatches = userMeds
        .filter((m) => m.name?.toLowerCase().includes(query) && !seen.has(m.name?.toLowerCase()))
        .map((m) => ({
          id: 'user-' + m.id,
          fields: { name: m.name, medClass: m.medication_class, icon: m.icon, iconColor: m.icon_color },
        }));
      const filtered = [...rxMatches, ...userMatches];
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (med) => {
    onSelect(med);
    setShowSuggestions(false);
  };

  return (
    <View>
      <TextInput
        label="Name"
        value={name}
        onChangeText={handleChange}
        mode="outlined"
        style={styles.input}
      />
      {showSuggestions && (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          {suggestions.slice(0, 5).map((med) => (
            <List.Item
              key={med.id}
              title={med.fields.name}
              description={med.fields.medClass}
              onPress={() => handleSelect(med)}
              style={styles.item}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { marginBottom: 12 },
  container: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: -8,
    marginBottom: 12,
    elevation: 3,
  },
  item: { paddingVertical: 2 },
});
