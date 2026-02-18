import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Chip, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { putMed, destroyMed, getRXGuideMeds, MED_ICONS, MED_COLORS, DEFAULT_ICON, DEFAULT_COLOR } from '@care/shared';

const ICON_MAP = { tablet: 'tablet', pill: 'pill', droplet: 'water' };

export default function MedEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [name, setName] = useState(item.name || '');
  const [reason, setReason] = useState(item.reason || '');
  const [medClass, setMedClass] = useState(item.medication_class || '');
  const [icon, setIcon] = useState(item.icon || DEFAULT_ICON);
  const [iconColor, setIconColor] = useState(item.icon_color || DEFAULT_COLOR);
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rxGuide, setRxGuide] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getRXGuideMeds().then(setRxGuide).catch(() => {});
  }, []);

  const handleNameChange = (text) => {
    setName(text);
    if (text.length > 0) {
      const filtered = rxGuide.filter((m) =>
        m.fields.name?.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (med) => {
    setName(med.fields.name);
    setMedClass(med.fields.medClass || '');
    setIcon(med.fields.icon || DEFAULT_ICON);
    setIconColor(med.fields.iconColor || DEFAULT_COLOR);
    setShowSuggestions(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putMed(id, {
        name,
        reason,
        medication_class: medClass,
        time: time.toISOString(),
        icon,
        icon_color: iconColor,
      });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Medication', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await destroyMed(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>Edit Medication</Text>

      {item.is_taken && <Chip icon="check" style={styles.chip}>Taken</Chip>}

      <View>
        <TextInput
          label="Name"
          value={name}
          onChangeText={handleNameChange}
          mode="outlined"
          style={styles.input}
        />
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            {suggestions.slice(0, 5).map((med) => (
              <List.Item
                key={med.id}
                title={med.fields.name}
                description={med.fields.medClass}
                onPress={() => handleSelectSuggestion(med)}
                style={styles.suggestionItem}
              />
            ))}
          </View>
        )}
      </View>

      <TextInput label="Reason" value={reason} onChangeText={setReason} mode="outlined" style={styles.input} />
      <TextInput label="Class" value={medClass} onChangeText={setMedClass} mode="outlined" style={styles.input} />

      <Text variant="labelLarge" style={styles.label}>Icon</Text>
      <View style={styles.iconRow}>
        {MED_ICONS.map((iconName) => (
          <TouchableOpacity
            key={iconName}
            onPress={() => setIcon(iconName)}
            style={[
              styles.iconButton,
              icon === iconName && { borderColor: iconColor, borderWidth: 2 },
            ]}
          >
            <MaterialCommunityIcons name={ICON_MAP[iconName]} size={28} color={iconColor} />
          </TouchableOpacity>
        ))}
      </View>

      <Text variant="labelLarge" style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {MED_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setIconColor(c)}
            style={[
              styles.colorSwatch,
              { backgroundColor: c },
              iconColor === c && styles.colorSwatchActive,
            ]}
          />
        ))}
      </View>

      <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
        Date: {time.toLocaleDateString()}
      </Button>
      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>

      {showDatePicker && (
        <DateTimePicker value={time} mode="date" onChange={(e, d) => { setShowDatePicker(false); if (d) setTime(d); }} />
      )}
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />
      )}

      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!name || loading} style={styles.button}>
        Save
      </Button>
      <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>
        Delete
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: { marginBottom: 16 },
  chip: { marginBottom: 12, alignSelf: 'flex-start' },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  label: { marginBottom: 4, marginTop: 8 },
  iconRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSwatchActive: { borderColor: '#333' },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginTop: -8,
    marginBottom: 12,
    elevation: 3,
  },
  suggestionItem: { paddingVertical: 2 },
});
