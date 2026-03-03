import { GoogleOAuthProvider } from '@react-oauth/google';
import AllUsersProvider from "../context/AllUsersContext";
import { CurrentUserProvider } from "../context/CurrentUserContext";
import { ThemeStateProvider } from "../context/ThemeStateContext";
import { DateProvider } from "../context/DateContext";
import reducer, { initialState } from '@care/shared/src/reducers/currentUserReducer';

console.log('clientId',process.env.REACT_APP_GOOGLE_CLIENT_ID )
export const appProviders = [
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''} />,
  <ThemeStateProvider />,
  <DateProvider />,
  <AllUsersProvider />,
  <CurrentUserProvider reducer={reducer} initialState={initialState} />,
];
