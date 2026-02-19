import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function LoginScreen({ navigation }) {
  const [, dispatch] = useCurrentUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await loginUser({ email, password });
      dispatch({ type: 'SET_USER', currentUser: user });
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper scroll keyboardAvoiding contentContainerStyle={styles.scroll}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logo}
      />
      <Text variant="headlineLarge" style={styles.title}>Care</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Sign in to your account</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
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

      {error ? <HelperText type="error">{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={!email || !password || loading}
        style={styles.button}
      >
        Sign In
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.link}
      >
        Forgot your password?
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.link}
      >
        Don't have an account? Sign Up
      </Button>

      <View style={styles.legalRow}>
        <Button
          mode="text"
          compact
          labelStyle={styles.legalLabel}
          onPress={() => navigation.getParent().navigate('PrivacyPolicy')}
        >
          Privacy Policy
        </Button>
        <Text style={styles.legalDivider}>|</Text>
        <Button
          mode="text"
          compact
          labelStyle={styles.legalLabel}
          onPress={() => navigation.getParent().navigate('TermsOfService')}
        >
          Terms of Service
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 12 },
  title: { textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
  legalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  legalLabel: { fontSize: 12 },
  legalDivider: { opacity: 0.5 },
});
