import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { verifyUser, getOneMed } from '@care/shared';
import { useCurrentUser } from '../context/CurrentUserContext';
import { registerForPushNotifications } from '../services/notifications';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/legal/TermsOfServiceScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator({ navigationRef }) {
  const [{ currentUser }, dispatch] = useCurrentUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await verifyUser();
        if (userData) {
          dispatch({ type: 'SET_USER', currentUser: userData });
        }
      } catch (error) {
        const email = error?.response?.data?.email;
        if (error?.response?.status === 403 && email) {
          dispatch({ type: 'SET_USER', currentUser: { email, email_verified: false } });
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser?.email_verified) {
      registerForPushNotifications();
    }
  }, [currentUser?.email_verified]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const data = response.notification.request.content.data;
      if (!data?.medication_id) return;

      const tryNavigate = async (retries = 5) => {
        for (let i = 0; i < retries; i++) {
          if (navigationRef?.current?.isReady()) {
            const med = await getOneMed(data.medication_id);
            navigationRef.current.navigate('Main', {
              screen: 'Home',
              params: {
                screen: 'MedEdit',
                params: { id: med.id, item: med },
              },
            });
            return;
          }
          await new Promise((r) => setTimeout(r, 500));
        }
        // navigation not ready after retries
      };

      tryNavigate().catch(() => {});
    });

    return () => subscription.remove();
  }, [navigationRef]);

  if (isLoading) return null;

  const needsVerification = currentUser && !currentUser.email_verified;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentUser ? (
        needsVerification ? (
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
            initialParams={{ email: currentUser.email }}
          />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: true, title: 'Privacy Policy' }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{ headerShown: true, title: 'Terms of Service' }}
      />
    </Stack.Navigator>
  );
}
