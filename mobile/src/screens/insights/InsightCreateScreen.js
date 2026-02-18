import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { postInsight } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function InsightCreateScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await postInsight({ title, description, body });
      navigation.goBack();
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>New Insight</Text>
      <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" style={styles.input} multiline />
      <TextInput label="Body" value={body} onChangeText={setBody} mode="outlined" style={[styles.input, styles.bodyInput]} multiline numberOfLines={6} />
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={!title || !description || loading} style={styles.button}>
        Publish
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
