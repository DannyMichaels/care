import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { postMed, MED_ICONS, MED_COLORS, MED_ICON_DISPLAY_MAP, DEFAULT_ICON, DEFAULT_COLOR, getApiError } from '@care/shared';
import { useDate } from '../../context/DateContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';
import MedicationSuggestions from '../../components/MedicationSuggestions';
import SchedulePicker from '../../components/SchedulePicker';

export default function MedCreateScreen({ navigation }) {
  const { getSelectedDateWithTime } = useDate();
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [medClass, setMedClass] = useState('');
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [iconColor, setIconColor] = useState(DEFAULT_COLOR);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleUnit, setScheduleUnit] = useState(null);
  const [scheduleInterval, setScheduleInterval] = useState(null);
  const [scheduleEndDate, setScheduleEndDate] = useState(null);

  const handleSelectSuggestion = (med) => {
    setName(med.fields.name);
    setMedClass(med.fields.medClass || '');
    setIcon(med.fields.icon || DEFAULT_ICON);
    setIconColor(med.fields.iconColor || DEFAULT_COLOR);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const medTime = getSelectedDateWithTime(time);

      await postMed({
        name,
        reason,
        medication_class: medClass,
        time: medTime,
        icon,
        icon_color: iconColor,
        schedule_unit: scheduleUnit,
        schedule_interval: scheduleInterval,
        schedule_end_date: scheduleEndDate,
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Add Medication</Text>

      <MedicationSuggestions name={name} onNameChange={setName} onSelect={handleSelectSuggestion} />

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
            <MaterialCommunityIcons name={MED_ICON_DISPLAY_MAP[iconName]} size={28} color={iconColor} />
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

      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>

      <DatePickerModal
        visible={showTimePicker}
        value={time}
        mode="time"
        onConfirm={(d) => { setShowTimePicker(false); setTime(d); }}
        onDismiss={() => setShowTimePicker(false)}
      />

      <SchedulePicker
        unit={scheduleUnit}
        interval={scheduleInterval}
        endDate={scheduleEndDate}
        onChange={({ unit, interval, endDate }) => {
          setScheduleUnit(unit);
          setScheduleInterval(interval);
          setScheduleEndDate(endDate);
        }}
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
});
