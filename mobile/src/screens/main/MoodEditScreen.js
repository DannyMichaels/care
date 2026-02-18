import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { putMood, destroyMood } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

export default function MoodEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [status, setStatus] = useState(item.status || 'Good');
  const [reason, setReason] = useState(item.reason || '');
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putMood(id, { status, reason, time: time.toISOString() });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Mood', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await destroyMood(id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Mood</Text>
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
      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={loading} style={styles.button}>Save</Button>
      <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>Delete</Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
});
