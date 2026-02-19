import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { putAffirmation, destroyAffirmation, getApiError } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function AffirmationEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [content, setContent] = useState(item.content || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putAffirmation(id, { content });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Affirmation', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await destroyAffirmation(id); navigation.goBack(); } catch (err) { Alert.alert('Error', getApiError(err)); }
      } },
    ]);
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Affirmation</Text>
      <TextInput label="I am..." value={content} onChangeText={setContent} mode="outlined" style={styles.input} multiline numberOfLines={4} />
      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!content || loading} style={styles.button}>Save</Button>
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
