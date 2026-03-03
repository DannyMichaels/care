import { useState } from 'react';
import { Platform } from 'react-native';
import { googleSignIn, getApiError } from '@care/shared';

let GoogleSignin = null;
try {
  ({ GoogleSignin } = require('@react-native-google-signin/google-signin'));
} catch {}

export const isGoogleAuthAvailable = !!GoogleSignin;

export default function useGoogleAuth(dispatch) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signIn = async () => {
    setError('');
    setLoading(true);
    try {
      if (Platform.OS === 'android') await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response?.data?.idToken;
      if (!idToken) throw new Error('No ID token received');
      const user = await googleSignIn(idToken);
      dispatch({ type: 'SET_USER', currentUser: user });
    } catch (err) {
      if (err?.code !== 'SIGN_IN_CANCELLED') {
        setError(getApiError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try { await GoogleSignin?.signOut(); } catch {}
  };

  return { signIn, signOut, loading, error, setError };
}
