import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { sendVerificationCode } from '@care/shared';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      return setError('Please enter your email');
    }

    setError('');
    setLoading(true);
    try {
      await sendVerificationCode(email);
      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Forgot Password</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter your email and we'll send you a verification code
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleSendCode}
        loading={loading}
        disabled={!email || loading}
        style={styles.button}
      >
        Send Code
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.link}
      >
        Back to Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
