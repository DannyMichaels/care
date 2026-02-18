import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { verifyUser } from '@care/shared';
import { useCurrentUser } from '../context/CurrentUserContext';
import { registerForPushNotifications } from '../services/notifications';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import EmailVerificationScreen from '../screens/auth/EmailVerificationScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
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
    </Stack.Navigator>
  );
}
