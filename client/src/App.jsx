import { useEffect } from 'react';
import { Paper } from '@material-ui/core';
import FirefoxBrowser from './screens/Error/FirefoxBrowser';
import { verifyUser } from '@care/shared';
import { useStateValue } from './context/CurrentUserContext';
import { firefoxAgent as isUsingFirefox } from './utils/detectBrowsers';
import AppRouter from './Router/AppRouter';

function App() {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await verifyUser();
        dispatch({ type: 'SET_USER', currentUser: userData });
      } catch (error) {
        const email = error?.response?.data?.email;
        if (error?.response?.status === 403 && email) {
          dispatch({ type: 'SET_USER', currentUser: { email, email_verified: false } });
        } else {
          localStorage.removeItem('authToken');
        }
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isUsingFirefox) {
    return <FirefoxBrowser firefoxAgent={isUsingFirefox} />;
  }

  return (
    <Paper style={{ minHeight: "100vh" }}>
      <AppRouter />
    </Paper>
  );
}

export default App;
