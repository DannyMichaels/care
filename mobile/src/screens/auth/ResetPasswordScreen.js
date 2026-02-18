import { useState, useRef } from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { resetPassword, sendVerificationCode } from '@care/shared';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleReset = async () => {
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      return setError('Please enter the full 6-digit code');
    }
    if (newPassword.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(email, fullCode, newPassword);
      navigation.navigate('Login');
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendVerificationCode(email);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch {
      setError('Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Reset Password</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter the code sent to {email}
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <RNTextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <TextInput
        label="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        mode="outlined"
      />

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleReset}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Reset Password
      </Button>

      <Button mode="text" onPress={handleResend} style={styles.link}>
        Resend Code
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
