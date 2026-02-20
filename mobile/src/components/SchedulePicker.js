import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, SegmentedButtons, Chip, TextInput, Button, useTheme } from 'react-native-paper';
import { SCHEDULE_PRESETS, getScheduleDescription } from '@care/shared';
import DatePickerModal from './DatePickerModal';

export default function SchedulePicker({ unit, interval, endDate, onChange }) {
  const { colors } = useTheme();
  const isScheduled = !!unit;
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleModeChange = (value) => {
    if (value === 'one-time') {
      onChange({ unit: null, interval: null, endDate: null });
      setAdvancedMode(false);
    } else {
      onChange({ unit: 'day', interval: 1, endDate });
    }
  };

  const handlePresetSelect = (preset) => {
    onChange({ unit: preset.unit, interval: preset.interval, endDate });
    setAdvancedMode(false);
  };

  const handleUnitChange = (value) => {
    onChange({ unit: value, interval: interval || 1, endDate });
  };

  const handleIntervalChange = (text) => {
    const num = parseInt(text, 10);
    if (!text) {
      onChange({ unit, interval: null, endDate });
    } else if (num >= 1 && num <= 99) {
      onChange({ unit, interval: num, endDate });
    }
  };

  const handleEndDateConfirm = (date) => {
    setShowEndDatePicker(false);
    onChange({ unit, interval, endDate: date.toLocaleDateString('en-CA') });
  };

  const clearEndDate = () => {
    onChange({ unit, interval, endDate: null });
  };

  const isPresetActive = (preset) => {
    return unit === preset.unit && interval === preset.interval;
  };

  const description = getScheduleDescription(unit, interval);

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>Schedule</Text>

      <SegmentedButtons
        value={isScheduled ? 'scheduled' : 'one-time'}
        onValueChange={handleModeChange}
        buttons={[
          { value: 'one-time', label: 'One-time' },
          { value: 'scheduled', label: 'Recurring' },
        ]}
        style={styles.segmented}
      />

      {isScheduled && (
        <View style={styles.scheduleOptions}>
          <View style={styles.modeToggle}>
            <Text
              variant="labelSmall"
              onPress={() => setAdvancedMode(false)}
              style={[styles.modeText, !advancedMode && { color: colors.primary }]}
            >
              Simple
            </Text>
            <Text variant="labelSmall" style={styles.modeSeparator}> | </Text>
            <Text
              variant="labelSmall"
              onPress={() => setAdvancedMode(true)}
              style={[styles.modeText, advancedMode && { color: colors.primary }]}
            >
              Advanced
            </Text>
          </View>

          {!advancedMode ? (
            <View style={styles.presetRow}>
              {SCHEDULE_PRESETS.map((preset) => (
                <Chip
                  key={preset.label}
                  selected={isPresetActive(preset)}
                  onPress={() => handlePresetSelect(preset)}
                  mode={isPresetActive(preset) ? 'flat' : 'outlined'}
                  style={isPresetActive(preset) ? { backgroundColor: colors.primaryContainer } : undefined}
                >
                  {preset.label}
                </Chip>
              ))}
            </View>
          ) : (
            <View style={styles.advancedRow}>
              <TextInput
                mode="outlined"
                label="Every"
                keyboardType="number-pad"
                value={interval ? String(interval) : ''}
                onChangeText={handleIntervalChange}
                style={styles.intervalInput}
                dense
              />
              <SegmentedButtons
                value={unit || 'day'}
                onValueChange={handleUnitChange}
                buttons={[
                  { value: 'day', label: 'Days' },
                  { value: 'week', label: 'Weeks' },
                  { value: 'month', label: 'Months' },
                ]}
                style={styles.unitButtons}
                density="small"
              />
            </View>
          )}

          {description ? (
            <Text variant="bodySmall" style={[styles.description, { color: colors.onSurfaceVariant }]}>
              {description}
            </Text>
          ) : null}

          <View style={styles.endDateRow}>
            {endDate ? (
              <Chip icon="calendar" onClose={clearEndDate}>
                Ends {endDate}
              </Chip>
            ) : (
              <Button
                mode="text"
                icon="calendar-end"
                compact
                onPress={() => setShowEndDatePicker(true)}
              >
                Set end date
              </Button>
            )}
          </View>

          <DatePickerModal
            visible={showEndDatePicker}
            value={endDate ? new Date(endDate + 'T00:00:00') : new Date()}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onDismiss={() => setShowEndDatePicker(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    marginTop: 8,
  },
  segmented: {
    marginBottom: 8,
  },
  scheduleOptions: {
    gap: 8,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeSeparator: {
    opacity: 0.3,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  advancedRow: {
    gap: 8,
  },
  intervalInput: {
    width: 100,
  },
  unitButtons: {
    flex: 1,
  },
  description: {
    fontStyle: 'italic',
  },
  endDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
