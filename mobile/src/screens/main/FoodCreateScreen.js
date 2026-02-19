import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { postFood, getApiError } from '@care/shared';
import { useDate } from '../../context/DateContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

export default function FoodCreateScreen({ navigation }) {
  const { getSelectedDateWithTime } = useDate();
  const [name, setName] = useState('');
  const [factors, setFactors] = useState('');
  const [rating, setRating] = useState(3);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postFood({ name, factors, rating, time: getSelectedDateWithTime(time) });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Log Food</Text>
      <TextInput label="Food Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} maxLength={20} />
      <TextInput label="Factors" value={factors} onChangeText={setFactors} mode="outlined" style={styles.input} maxLength={131} />
      <View style={styles.ratingRow}>
        <Text variant="bodyLarge" style={styles.ratingLabel}>Rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setRating(n)}>
              <MaterialCommunityIcons
                name={n <= rating ? 'star' : 'star-outline'}
                size={36}
                color="#FFB300"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    marginRight: 12,
    opacity: 0.7,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  button: { marginTop: 8, paddingVertical: 4 },
});
