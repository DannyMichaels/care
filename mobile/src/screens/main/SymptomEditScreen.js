import { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { putSymptom, destroySymptom } from '@care/shared';

export default function SymptomEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [name, setName] = useState(item.name || '');
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putSymptom(id, { name, time: time.toISOString() });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Symptom', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await destroySymptom(id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Symptom</Text>
      <TextInput label="Symptom" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={32} />
      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.input}>
        Time: {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>
      {showTimePicker && (
        <DateTimePicker value={time} mode="time" onChange={(e, d) => { setShowTimePicker(false); if (d) setTime(d); }} />
      )}
      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!name || loading} style={styles.button}>Save</Button>
      <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>Delete</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});
