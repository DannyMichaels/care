import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import { postMed, getRXGuideMeds, selectedDateToLocal, MED_ICONS, MED_COLORS, DEFAULT_ICON, DEFAULT_COLOR } from '@care/shared';
import { useDate } from '../../context/DateContext';
import { scheduleLocalMedReminder } from '../../services/notifications';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

const ICON_MAP = { tablet: 'circle', pill: 'pill', droplet: 'water' };

export default function MedCreateScreen({ navigation }) {
  const { selectedDate, showAllDates } = useDate();
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [medClass, setMedClass] = useState('');
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [iconColor, setIconColor] = useState(DEFAULT_COLOR);
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rxGuide, setRxGuide] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const needsDatePicker = showAllDates;

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const medTime = needsDatePicker
        ? time.toISOString()
        : dayjs(selectedDate).hour(time.getHours()).minute(time.getMinutes()).second(0).toISOString();

      const newMed = await postMed({
        name,
        reason,
        medication_class: medClass,
        time: medTime,
        icon,
        icon_color: iconColor,
      });
      await scheduleLocalMedReminder(newMed);
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Add Medication</Text>

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

      {needsDatePicker && (
        <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
          Date: {time.toLocaleDateString()}
        </Button>
      )}

      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>

      <DatePickerModal
        visible={showDatePicker}
        value={time}
        mode="date"
        onConfirm={(d) => { setShowDatePicker(false); setTime(d); }}
        onDismiss={() => setShowDatePicker(false)}
      />

      <DatePickerModal
        visible={showTimePicker}
        value={time}
        mode="time"
        onConfirm={(d) => { setShowTimePicker(false); setTime(d); }}
        onDismiss={() => setShowTimePicker(false)}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={!name || loading}
        style={styles.button}
      >
        Save
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
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
