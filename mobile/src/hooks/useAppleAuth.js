import { useState } from 'react';
import { Platform } from 'react-native';
import { appleSignIn, getApiError } from '@care/shared';

let AppleAuthentication = null;
try {
  AppleAuthentication = require('expo-apple-authentication');
} catch {}

export const isAppleAuthAvailable = Platform.OS === 'ios' && !!AppleAuthentication;

export default function useAppleAuth(dispatch) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signIn = async () => {
    setError('');
    setLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const identityToken = credential.identityToken;
      if (!identityToken) throw new Error('No identity token received');
      const fullName = credential.fullName
        ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
        : null;
      const user = await appleSignIn(identityToken, fullName);
      dispatch({ type: 'SET_USER', currentUser: user });
    } catch (err) {
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        setError(getApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Apple doesn't provide a sign-out SDK method
  };

  return { signIn, signOut, loading, error, setError };
}
