import { Switch, Route } from "react-router";
import InsightsContainer from "../containers/InsightsContainer";
import UsersContainer from "../containers/UsersContainer";
import Login from "../screens/auth/Login/Login";
import Register from "../screens/auth/Register/Register";
import EmailVerification from "../screens/auth/EmailVerification/EmailVerification";
import ForgotPassword from "../screens/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../screens/auth/ResetPassword/ResetPassword";
import NotFound from "../screens/Error/NotFound";
import Home from "../screens/main/Home/Home";
import Settings from "../screens/main/Settings/Settings";
import LegalPage from "../screens/legal/LegalPage";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/verify-email" component={EmailVerification} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />
    <Route path="/privacy" component={LegalPage} />
    <Route path="/terms" component={LegalPage} />
    <PrivateRoute path="/insights" component={InsightsContainer} />
    <PrivateRoute path="/settings" component={Settings} />
    <PrivateRoute path="/users" component={UsersContainer} />
    <PrivateRoute path="/" component={Home} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default AppRouter;
