import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { registerUser, sendVerificationCode } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';

export default function RegisterScreen({ navigation }) {
  const [, dispatch] = useCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    gender: 'Male',
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    setError('');

    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (formData.password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const user = await registerUser(formData);
      dispatch({ type: 'SET_USER', currentUser: user });

      // Send verification code after registration
      await sendVerificationCode(formData.email);
      navigation.navigate('EmailVerification', { email: formData.email });
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text variant="headlineLarge" style={styles.title}>Create Account</Text>

        <TextInput
          label="Name"
          value={formData.name}
          onChangeText={(v) => handleChange('name', v)}
          style={styles.input}
          mode="outlined"
          maxLength={20}
        />

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={formData.password}
          onChangeText={(v) => handleChange('password', v)}
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
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Birthday (YYYY-MM-DD)"
          value={formData.birthday}
          onChangeText={(v) => handleChange('birthday', v)}
          style={styles.input}
          mode="outlined"
          placeholder="1990-01-15"
        />

        {error ? <HelperText type="error">{error}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={!formData.name || !formData.email || !formData.password || loading}
          style={styles.button}
        >
          Sign Up
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.link}
        >
          Already have an account? Sign In
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
