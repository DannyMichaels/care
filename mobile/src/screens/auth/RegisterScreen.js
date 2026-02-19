import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextInput, Button, Text, HelperText, Checkbox } from 'react-native-paper';
import { registerUser, sendVerificationCode, getApiError } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import DatePickerModal from '../../components/DatePickerModal';

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateConfirm = (date) => {
    setShowDatePicker(false);
    setBirthdayDate(date);
    handleChange('birthday', date.toLocaleDateString('en-CA'));
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
      setError(getApiError(err));
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

      <View style={styles.termsRow}>
        <Checkbox
          status={agreedToTerms ? 'checked' : 'unchecked'}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        />
        <View style={styles.termsText}>
          <Text variant="bodySmall">
            I agree to the{' '}
          </Text>
          <Text
            variant="bodySmall"
            style={styles.termsLink}
            onPress={() => navigation.getParent().navigate('TermsOfService')}
          >
            Terms of Service
          </Text>
          <Text variant="bodySmall"> and </Text>
          <Text
            variant="bodySmall"
            style={styles.termsLink}
            onPress={() => navigation.getParent().navigate('PrivacyPolicy')}
          >
            Privacy Policy
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={!formData.name || !formData.email || !formData.password || !agreedToTerms || loading}
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
  title: { textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  termsText: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
  termsLink: { textDecorationLine: 'underline' },
  button: { marginTop: 8, paddingVertical: 4 },
  link: { marginTop: 8 },
  legalRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  legalLabel: { fontSize: 12 },
  legalDivider: { opacity: 0.5 },
});
