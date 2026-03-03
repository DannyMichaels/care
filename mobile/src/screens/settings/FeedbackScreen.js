import { useState } from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { View } from 'react-native';
import { Text, TextInput, Button, RadioButton, useTheme } from 'react-native-paper';
import * as Device from 'expo-device';
import ScreenWrapper from '../../components/ScreenWrapper';

const FEEDBACK_EMAIL = 'care.netlify.app@gmail.com';

function getDeviceInfo() {
  return [
    `Device: ${Device.manufacturer ?? 'Unknown'} ${Device.modelName ?? 'Unknown'}`,
    `OS: ${Platform.OS} ${Platform.Version}`,
    `App Version: ${Device.osName ?? Platform.OS}`,
  ].join('\n');
}

export default function FeedbackScreen() {
  const theme = useTheme();
  const [type, setType] = useState('bug');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const subjectPrefix = type === 'bug' ? 'Bug Report' : 'General Feedback';
    const subject = encodeURIComponent(`[Care] ${subjectPrefix}`);
    const body = encodeURIComponent(
      `${subjectPrefix}\n${'—'.repeat(20)}\n\n${description}\n\n${'—'.repeat(20)}\nDevice Info:\n${getDeviceInfo()}`
    );
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <ScreenWrapper scroll keyboardAvoiding contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Send Feedback</Text>

      <RadioButton.Group onValueChange={setType} value={type}>
        <View style={[
          styles.radioOption,
          { borderColor: type === 'bug' ? theme.colors.primary : theme.colors.outline }
        ]}>
          <RadioButton.Item label="Bug Report" value="bug" style={styles.radioItem} />
        </View>
        <View style={[
          styles.radioOption,
          { borderColor: type === 'feedback' ? theme.colors.primary : theme.colors.outline }
        ]}>
          <RadioButton.Item label="General Feedback" value="feedback" style={styles.radioItem} />
        </View>
      </RadioButton.Group>

      <TextInput
        label="Description"
        mode="outlined"
        multiline
        numberOfLines={6}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholder="Tell us what happened..."
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!description.trim()}
        style={styles.submit}
      >
        Submit
      </Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { textAlign: 'center' },
  radioOption: { borderWidth: 1, borderRadius: 8, marginBottom: 8 },
  radioItem: { paddingVertical: 4 },
  input: { minHeight: 120 },
  submit: {},
});
