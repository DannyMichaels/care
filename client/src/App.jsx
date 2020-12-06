import "./App.css";
import { Paper } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import { CurrentUserProvider } from "./components/Context/CurrentUserContext";
import Home from "./screens/main/Home";
import Settings from "./screens/main/Settings";
import InsightsContainer from "./containers/InsightsContainer";
import UsersContainer from "./containers/UsersContainer";
import { LightModeProvider } from "./components/Context/LightModeContext";
import NotFound from "./screens/Error/NotFound";
import Maintenance from "./screens/Maintenance/Maintenance";

function App() {
  return (
    <CurrentUserProvider>
      <Paper>
        <LightModeProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/insights" component={InsightsContainer} />
            <Route path="/settings" component={Settings} />
            <Route path="/users" component={UsersContainer} />
            <Route path="/maintenance" component={Maintenance} />
            <Route path="/" component={Home} />
            <Route path="*" component={NotFound} />
          </Switch>
        </LightModeProvider>
      </Paper>
    </CurrentUserProvider>
  );
}

export default App;
