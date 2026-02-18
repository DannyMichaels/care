import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { postSymptom } from '@care/shared';
import { useDate } from '../../context/DateContext';

export default function SymptomCreateScreen({ navigation }) {
  const { selectedDate } = useDate();
  const [name, setName] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postSymptom({ name, time: `${selectedDate}T${time.toTimeString().slice(0, 5)}` });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Log Symptom</Text>
      <TextInput label="Symptom" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={32} />
      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />
      )}
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={!name || loading} style={styles.button}>Save</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
});
