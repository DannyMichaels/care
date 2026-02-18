import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { sendVerificationCode } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

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
    <ScreenWrapper keyboardAvoiding style={styles.container}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logo}
      />
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', padding: 24 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 12 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
