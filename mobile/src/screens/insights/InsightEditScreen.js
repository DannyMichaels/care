import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { putInsight } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function InsightEditScreen({ route, navigation }) {
  const { id, item } = route.params;
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');
  const [body, setBody] = useState(item.body || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await putInsight(id, { title, description, body });
      navigation.goBack();
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg) {
        Alert.alert('Content Moderation', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Insight</Text>
      <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} multiline />
      <TextInput label="Body" value={body} onChangeText={setBody} mode="outlined" style={[styles.input, styles.bodyInput]} multiline numberOfLines={6} />
      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={!title || loading} style={styles.button}>
        Save
      </Button>
      <Button mode="text" onPress={() => navigation.goBack()}>Cancel</Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { marginBottom: 16 },
  input: { marginBottom: 12 },
  bodyInput: { minHeight: 150, textAlignVertical: 'top' },
  button: { marginTop: 8, paddingVertical: 4 },
});
