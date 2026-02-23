import { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Text, Chip, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { putMed, destroyMed, createOccurrence, updateOccurrence, deleteOccurrence, isScheduledMed, MED_ICONS, MED_COLORS, MED_ICON_DISPLAY_MAP, DEFAULT_ICON, DEFAULT_COLOR, getApiError } from '@care/shared';
import { useDate } from '../../context/DateContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';
import MedicationSuggestions from '../../components/MedicationSuggestions';
import SchedulePicker from '../../components/SchedulePicker';
import MedDeleteModal from '../../components/MedDeleteModal';

export default function MedEditScreen({ route, navigation }) {
  const { id, item, occurrence } = route.params;
  const { selectedDate } = useDate();
  const [name, setName] = useState(item.name || '');


  const [icon, setIcon] = useState(item.icon || DEFAULT_ICON);
  const [iconColor, setIconColor] = useState(item.icon_color || DEFAULT_COLOR);
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isTaken, setIsTaken] = useState(
    isScheduledMed(item) ? !!occurrence?.is_taken : !!item.is_taken
  );
  const [loading, setLoading] = useState(false);
  const [scheduleUnit, setScheduleUnit] = useState(item.schedule_unit || null);
  const [scheduleInterval, setScheduleInterval] = useState(item.schedule_interval || null);
  const [scheduleEndDate, setScheduleEndDate] = useState(item.schedule_end_date || null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const scheduled = isScheduledMed(item);

  const handleSelectSuggestion = (med) => {
    setName(med.fields.name);

    setIcon(med.fields.icon || DEFAULT_ICON);
    setIconColor(med.fields.iconColor || DEFAULT_COLOR);
  };

  const buildMedData = () => ({
    name,

    time: time.toISOString(),
    icon,
    icon_color: iconColor,
    schedule_unit: scheduleUnit,
    schedule_interval: scheduleInterval,
    schedule_end_date: scheduleEndDate,
  });

  const saveMed = async (options = {}) => {
    setLoading(true);
    try {
      await putMed(id, buildMedData(), options);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const timeChanged = () => {
    if (!item.time) return false;
    const orig = new Date(item.time);
    return orig.getHours() !== time.getHours() || orig.getMinutes() !== time.getMinutes();
  };

  const handleUpdate = () => {
    const wasScheduled = isScheduledMed(item);
    const becomingOneTime = wasScheduled && !scheduleUnit;

    if (becomingOneTime) {
      Alert.alert(
        'Convert to One-Time',
        'What would you like to do with past occurrence records?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Keep history',
            onPress: () => saveMed({ conversion_date: selectedDate, occurrence_action: 'keep' }),
          },
          {
            text: 'Delete all',
            style: 'destructive',
            onPress: () => saveMed({ conversion_date: selectedDate, occurrence_action: 'delete_all' }),
          },
        ]
      );
      return;
    }

    if (wasScheduled && timeChanged()) {
      Alert.alert(
        'Change Time',
        'Change the time for all occurrences or just this day?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'All occurrences',
            onPress: () => saveMed(),
          },
          {
            text: 'Just this day',
            onPress: async () => {
              setLoading(true);
              try {
                const medData = { ...buildMedData(), time: item.time };
                await putMed(id, medData);
                const newTime = time.toISOString();
                if (occurrence?.id) {
                  await updateOccurrence(id, occurrence.id, { time: newTime });
                } else {
                  await createOccurrence(id, { occurrence_date: selectedDate, time: newTime });
                }
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
      return;
    }

    saveMed();
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
              if (scheduled) {
                await createOccurrence(id, {
                  occurrence_date: selectedDate,
                  is_taken: true,
                  taken_date: new Date().toISOString(),
                });
              } else {
                await putMed(id, { is_taken: true, taken_date: new Date().toISOString() });
              }
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
              if (scheduled && occurrence?.id) {
                await updateOccurrence(id, occurrence.id, { is_taken: false, taken_date: null });
              } else {
                await putMed(id, { is_taken: false, taken_date: null });
              }
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

  const handleSkipDay = async () => {
    setShowDeleteModal(false);
    try {
      await createOccurrence(id, { occurrence_date: selectedDate, skipped: true });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    }
  };

  const handleStopMed = async () => {
    setShowDeleteModal(false);
    try {
      await putMed(id, { schedule_end_date: selectedDate });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    }
  };

  const handleDeleteMed = async () => {
    setShowDeleteModal(false);
    try {
      await destroyMed(id);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Medication</Text>

      {(scheduled ? occurrence?.skipped : item.skipped) ? (
        <Chip
          icon="calendar-remove"
          onPress={async () => {
            try {
              if (scheduled && occurrence?.id) {
                await deleteOccurrence(id, occurrence.id);
              } else {
                await putMed(id, { skipped: false });
              }
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', getApiError(err));
            }
          }}
          onClose={async () => {
            try {
              if (scheduled && occurrence?.id) {
                await deleteOccurrence(id, occurrence.id);
              } else {
                await putMed(id, { skipped: false });
              }
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', getApiError(err));
            }
          }}
          style={[styles.chip, { backgroundColor: '#E0E0E0' }]}
        >
          Skipped — tap to unskip
        </Chip>
      ) : isTaken ? (
        <Chip icon="check" onPress={handleUntake} onClose={handleUntake} style={styles.chip}>Taken</Chip>
      ) : (
        <Button mode="contained" icon="check" onPress={handleMarkTaken} disabled={loading} style={styles.takenButton} buttonColor="#4CAF50">
          Mark as Taken
        </Button>
      )}

      <MedicationSuggestions name={name} onNameChange={setName} onSelect={handleSelectSuggestion} />


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
              c === '#FFFFFF' && { borderColor: '#ccc', borderWidth: 1 },
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

      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!name || loading} style={styles.button}>
        Save
      </Button>
      {!(scheduled ? occurrence?.skipped : item.skipped) && (
        <Button
          mode="outlined"
          icon="calendar-remove"
          onPress={() => {
            Alert.alert('Skip', `Skip ${name}${scheduled ? ` for ${selectedDate}` : ''}?`, [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Skip',
                onPress: async () => {
                  try {
                    if (scheduled) {
                      await createOccurrence(id, { occurrence_date: selectedDate, skipped: true });
                    } else {
                      await putMed(id, { skipped: true });
                    }
                    navigation.goBack();
                  } catch (err) {
                    Alert.alert('Error', getApiError(err));
                  }
                },
              },
            ]);
          }}
          style={styles.button}
        >
          Skip
        </Button>
      )}
      <Button mode="outlined" onPress={() => setShowDeleteModal(true)} textColor="red" style={styles.button}>
        Delete
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>

      <MedDeleteModal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        name={name}
        scheduled={scheduled}
        onSkipDay={handleSkipDay}
        onStopMed={handleStopMed}
        onDeleteMed={handleDeleteMed}
      />
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
