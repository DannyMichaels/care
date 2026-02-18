import { useState, useEffect } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme as useAppTheme } from '../context/ThemeContext';

export default function DatePickerModal({ visible, value, mode = 'date', onConfirm, onDismiss, maximumDate }) {
  const { colors } = useTheme();
  const { isDark } = useAppTheme();
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (visible) setTempValue(value);
  }, [visible]);

  if (!visible) return null;

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        maximumDate={maximumDate}
        themeVariant={isDark ? 'dark' : 'light'}
        onChange={(e, date) => {
          if (e.type === 'dismissed') {
            onDismiss();
          } else if (date) {
            onConfirm(date);
          }
        }}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceVariant }]}>
      <DateTimePicker
        value={tempValue}
        mode={mode}
        display="spinner"
        maximumDate={maximumDate}
        themeVariant={isDark ? 'dark' : 'light'}
        onChange={(e, date) => { if (date) setTempValue(date); }}
      />
      <View style={styles.actions}>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button mode="contained" onPress={() => onConfirm(tempValue)}>Done</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
