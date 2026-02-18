import { useState, useRef } from 'react';
import { View, Image, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Button, Text, HelperText, useTheme } from 'react-native-paper';
import { verifyCode, sendVerificationCode } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function EmailVerificationScreen({ route, navigation }) {
  const { email } = route.params;
  const [{ currentUser }, dispatch] = useCurrentUser();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputs = useRef([]);
  const { colors } = useTheme();

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

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      return setError('Please enter the full 6-digit code');
    }

    setError('');
    setLoading(true);
    try {
      await verifyCode(email, fullCode);
      // Update current user context so RootNavigator shows MainTabs
      if (currentUser) {
        dispatch({ type: 'SET_USER', currentUser: { ...currentUser, email_verified: true } });
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await sendVerificationCode(email);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch {
      setError('Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenWrapper keyboardAvoiding style={styles.container}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logo}
      />
      <Text variant="headlineMedium" style={styles.title}>Verify Your Email</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        We sent a 6-digit code to {email}
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <RNTextInput
            key={i}
            ref={(ref) => (inputs.current[i] = ref)}
            style={[styles.codeInput, { color: colors.onSurface, borderColor: colors.outline }]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {error ? <HelperText type="error" style={styles.error}>{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Verify
      </Button>

      <Button
        mode="text"
        onPress={handleResend}
        loading={resendLoading}
        disabled={resendLoading}
        style={styles.link}
      >
        Resend Code
      </Button>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', padding: 24 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 12 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  codeRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: { textAlign: 'center' },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
