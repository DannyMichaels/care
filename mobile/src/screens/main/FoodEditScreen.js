import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { putFood, destroyFood, getApiError } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';
import StarRating from '../../components/StarRating';

export default function FoodEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [name, setName] = useState(item.name || '');
  const [factors, setFactors] = useState(item.factors || '');
  const [rating, setRating] = useState(item.rating || 3);
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putFood(id, { name, factors, rating, time: time.toISOString() });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Food', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await destroyFood(id); navigation.goBack(); } catch (err) { Alert.alert('Error', getApiError(err)); }
      } },
    ]);
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Food</Text>
      <TextInput label="Food Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={20} />
      <TextInput label="Factors" value={factors} onChangeText={setFactors} mode="outlined" style={styles.input} maxLength={131} />
      <StarRating value={rating} onChange={setRating} />
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
      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!name || loading} style={styles.button}>Save</Button>
      <Button mode="outlined" onPress={handleDelete} textColor="red" style={styles.button}>Delete</Button>
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
