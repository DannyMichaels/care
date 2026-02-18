import { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { putFood, destroyFood } from '@care/shared';

export default function FoodEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [name, setName] = useState(item.name || '');
  const [factors, setFactors] = useState(item.factors || '');
  const [rating, setRating] = useState(String(item.rating || 3));
  const [time, setTime] = useState(item.time ? new Date(item.time) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putFood(id, { name, factors, rating: Number(rating), time: time.toISOString() });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Food', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await destroyFood(id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Food</Text>
      <TextInput label="Food Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={20} />
      <TextInput label="Factors" value={factors} onChangeText={setFactors} mode="outlined" style={styles.input} maxLength={131} />
      <TextInput label="Rating (1-5)" value={rating} onChangeText={setRating} mode="outlined" style={styles.input} keyboardType="number-pad" />
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
