import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Alert, Linking } from 'react-native';
import { View } from 'react-native';
import { Text, Avatar, Button, Switch, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { removeToken, getAge, toTitleCase, destroyUser } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { useTheme } from '../../context/ThemeContext';
import { registerForPushNotifications } from '../../services/notifications';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function SettingsScreen() {
  const [{ currentUser }, dispatch] = useCurrentUser();
  const { isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushDenied, setPushDenied] = useState(false);
  const [isDevice, setIsDevice] = useState(false);

  const checkPushStatus = useCallback(async () => {
    if (!Device.isDevice) return;
    setIsDevice(true);
    const { status } = await Notifications.getPermissionsAsync();
    setPushEnabled(status === 'granted');
    setPushDenied(status === 'denied');
  }, []);

  useEffect(() => {
    checkPushStatus();
    const unsubscribe = navigation.addListener('focus', checkPushStatus);
    return unsubscribe;
  }, [checkPushStatus, navigation]);

  const handlePushToggle = async () => {
    if (pushEnabled) {
      Alert.alert(
        'Disable Notifications',
        'To disable, go to device Settings > Apps > Care > Notifications',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    const token = await registerForPushNotifications();
    if (token) {
      await checkPushStatus();
    } else {
      Alert.alert(
        'Notifications Blocked',
        'Push notifications are blocked. Please enable them in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const handleLogout = async () => {
    await removeToken();
    dispatch({ type: 'REMOVE_USER' });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await destroyUser(currentUser.id);
              await removeToken();
              dispatch({ type: 'REMOVE_USER' });
            } catch {}
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.profile}>
        {currentUser?.image ? (
          <Avatar.Image size={80} source={{ uri: currentUser.image }} />
        ) : (
          <Avatar.Text size={80} label={currentUser?.name?.[0]?.toUpperCase()} />
        )}
        <Text variant="headlineSmall" style={styles.name}>
          {toTitleCase(currentUser?.name)}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>{currentUser?.email}</Text>
        {currentUser?.birthday && (
          <Text variant="bodySmall" style={styles.meta}>
            Age: {getAge(currentUser.birthday)}
          </Text>
        )}
      </View>

      <Divider />

      <List.Item
        title="Dark Mode"
        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
        right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
      />

      {isDevice && (
        <>
          <List.Item
            title="Push Notifications"
            description={pushDenied ? 'Blocked — tap to open settings' : undefined}
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch value={pushEnabled} onValueChange={handlePushToggle} disabled={pushDenied} />
            )}
            onPress={pushDenied ? () => Linking.openSettings() : undefined}
          />
          <Divider />
        </>
      )}

      <Divider />

      <List.Item
        title="Privacy Policy"
        left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
        onPress={() => navigation.getParent().navigate('PrivacyPolicy')}
      />
      <List.Item
        title="Terms of Service"
        left={(props) => <List.Icon {...props} icon="file-document-outline" />}
        onPress={() => navigation.getParent().navigate('TermsOfService')}
      />

      <Divider />

      <View style={styles.actions}>
        <Button mode="contained" onPress={handleLogout} style={styles.button}>
          Log Out
        </Button>
        <Button mode="outlined" onPress={handleDeleteAccount} textColor="red" style={styles.button}>
          Delete Account
        </Button>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profile: { alignItems: 'center', padding: 24 },
  name: { marginTop: 12 },
  email: { opacity: 0.6, marginTop: 4 },
  meta: { opacity: 0.5, marginTop: 2 },
  actions: { padding: 24, gap: 12 },
  button: {},
});
