import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import dayjs from 'dayjs';
import { postMood } from '@care/shared';
import { useDate } from '../../context/DateContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

export default function MoodCreateScreen({ navigation }) {
  const { selectedDate } = useDate();
  const [status, setStatus] = useState('Good');
  const [reason, setReason] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dt = dayjs(selectedDate).hour(time.getHours()).minute(time.getMinutes()).second(0);
      await postMood({ status, reason, time: dt.toISOString() });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Log Mood</Text>
      <Text variant="titleMedium" style={styles.label}>How are you feeling?</Text>
      <RadioButton.Group onValueChange={setStatus} value={status}>
        <RadioButton.Item label="Poor" value="Poor" />
        <RadioButton.Item label="Okay" value="Okay" />
        <RadioButton.Item label="Good" value="Good" />
        <RadioButton.Item label="Great" value="Great" />
      </RadioButton.Group>
      <TextInput label="Reason" value={reason} onChangeText={setReason} mode="outlined" style={styles.input} multiline />
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
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>Save</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  label: { marginBottom: 8 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
});
