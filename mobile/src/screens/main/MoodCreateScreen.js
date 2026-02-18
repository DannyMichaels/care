import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { postMood } from '@care/shared';
import { useDate } from '../../context/DateContext';

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
      await postMood({ status, reason, time: `${selectedDate}T${time.toTimeString().slice(0, 5)}` });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />
      )}
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>Save</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: { marginBottom: 16 },
  label: { marginBottom: 8 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
});
