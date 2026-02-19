import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Paper } from "@material-ui/core";
import FirefoxBrowser from "./screens/Error/FirefoxBrowser";
import { verifyUser } from '@care/shared';
import { useStateValue } from "./context/CurrentUserContext";
import { firefoxAgent as isUsingFirefox } from "./utils/detectBrowsers";
import AppRouter from "./Router/AppRouter";

function App() {
  const [, dispatch] = useStateValue();
  const { push } = useHistory();
  const { pathname } = useLocation();

  useEffect(async () => {
    const isPublicRoute =
      pathname.match(/^\/login$/i) ||
      pathname.match(/^\/register$/i) ||
      pathname.match(/^\/verify-email/i) ||
      pathname.match(/^\/forgot-password/i) ||
      pathname.match(/^\/reset-password/i) ||
      pathname.match(/^\/(privacy|terms)$/i);

    try {
      const userData = await verifyUser();
      dispatch({ type: "SET_USER", currentUser: userData });
      if (!userData && !isPublicRoute) {
        push('/login');
      }
    } catch (error) {
      const email = error?.response?.data?.email;
      if (error?.response?.status === 403 && email && !isPublicRoute) {
        push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (!isPublicRoute) {
        push('/login');
      }
    }
  }, [dispatch, push, pathname]);

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
