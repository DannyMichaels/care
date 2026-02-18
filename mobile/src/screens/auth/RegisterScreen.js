import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { registerUser, sendVerificationCode } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function RegisterScreen({ navigation }) {
  const [, dispatch] = useCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    gender: 'Male',
  });
  const [birthdayDate, setBirthdayDate] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateConfirm = (date) => {
    setShowDatePicker(false);
    setBirthdayDate(date);
    handleChange('birthday', formatDate(date));
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
    <ScreenWrapper scroll keyboardAvoiding contentContainerStyle={styles.scroll}>
      <Image
        source={require('../../../assets/icon.png')}
        style={styles.logo}
      />
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

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Date of Birth"
          value={formData.birthday}
          style={styles.input}
          mode="outlined"
          editable={false}
          right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
          placeholder="Tap to select"
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DatePickerModal
        visible={showDatePicker}
        value={birthdayDate}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handleDateConfirm}
        onDismiss={() => setShowDatePicker(false)}
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 12 },
  title: { textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
});
