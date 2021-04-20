import { useMemo, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Paper } from "@material-ui/core";
import FirefoxBrowser from "./screens/Error/FirefoxBrowser";
import { verifyUser } from "./services/auth";
import { useStateValue } from "./context/CurrentUserContext";
import { firefoxAgent as isUsingFirefox } from "./utils/detectBrowsers";
import AppRouter from "./Router/AppRouter";
import api from "./services/apiConfig";

function App() {
  const [, dispatch] = useStateValue();
  const { push } = useHistory();
  const { pathname } = useLocation();

  useMemo(async () => {
    const userData = await verifyUser();
    dispatch({ type: "SET_USER", currentUser: userData });

    if (
      !userData &&
      !pathname.match(/^\/login$/i) &&
      !pathname.match(/^\/register$/i)
    ) {
      /* PrivateRoute.jsx should take care of this for lines 22-27, but... 
      This is for the case when heroku is deciding to hibernate big time. */
      push("/login");
    }
  }, [dispatch, push, pathname]);

  useEffect(() => {
    const getData = async () => {
      await api.get("/api/tests").then(({ data }) => {
        console.log(data);
      });
    };
    getData();
  }, []);

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
