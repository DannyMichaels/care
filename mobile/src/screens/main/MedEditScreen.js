import { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Text, Chip, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { putMed, destroyMed, MED_ICONS, MED_COLORS, MED_ICON_DISPLAY_MAP, DEFAULT_ICON, DEFAULT_COLOR, getApiError } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';
import MedicationSuggestions from '../../components/MedicationSuggestions';

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
  const [isTaken, setIsTaken] = useState(!!item.is_taken);
  const [loading, setLoading] = useState(false);

  const handleSelectSuggestion = (med) => {
    setName(med.fields.name);
    setMedClass(med.fields.medClass || '');
    setIcon(med.fields.icon || DEFAULT_ICON);
    setIconColor(med.fields.iconColor || DEFAULT_COLOR);
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
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaken = () => {
    Alert.alert(
      'Mark as Taken',
      `Did you take ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I took it',
          onPress: async () => {
            setLoading(true);
            try {
              await putMed(id, { is_taken: true, taken_date: new Date().toISOString() });
              setIsTaken(true);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', getApiError(err));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleUntake = () => {
    Alert.alert(
      'Undo Taken',
      `Mark ${name} as not taken?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Undo',
          onPress: async () => {
            setLoading(true);
            try {
              await putMed(id, { is_taken: false, taken_date: null });
              setIsTaken(false);
            } catch (err) {
              Alert.alert('Error', getApiError(err));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert('Delete Medication', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try { await destroyMed(id); navigation.goBack(); } catch (err) { Alert.alert('Error', getApiError(err)); }
        },
      },
    ]);
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Medication</Text>

      {isTaken
        ? <Chip icon="check" onPress={handleUntake} onClose={handleUntake} style={styles.chip}>Taken</Chip>
        : (
          <Button mode="contained" icon="check" onPress={handleMarkTaken} disabled={loading} style={styles.takenButton} buttonColor="#4CAF50">
            Mark as Taken
          </Button>
        )
      }

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

      <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.input}>
        Date: {time.toLocaleDateString()}
      </Button>
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

      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!name || loading} style={styles.button}>
        Save
      </Button>
      <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>
        Delete
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  chip: { marginBottom: 12, alignSelf: 'flex-start' },
  takenButton: { marginBottom: 12, alignSelf: 'stretch' },
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
