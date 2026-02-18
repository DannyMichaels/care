import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import dayjs from 'dayjs';
import { postSymptom } from '@care/shared';
import { useDate } from '../../context/DateContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

export default function SymptomCreateScreen({ navigation }) {
  const { selectedDate } = useDate();
  const [name, setName] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dt = dayjs(selectedDate).hour(time.getHours()).minute(time.getMinutes()).second(0);
      await postSymptom({ name, time: dt.toISOString() });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Log Symptom</Text>
      <TextInput label="Symptom" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={32} />
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
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={!name || loading} style={styles.button}>Save</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
});
