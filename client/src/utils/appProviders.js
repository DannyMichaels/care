import AllUsersProvider from "../context/AllUsersContext";
import { CurrentUserProvider } from "../context/CurrentUserContext";
import { ThemeStateProvider } from "../context/ThemeStateContext";
import { DateProvider } from "../context/DateContext";
import reducer, { initialState } from "../reducers/currentUserReducer";

export const appProviders = [
  <ThemeStateProvider />,
  <DateProvider />,
  <AllUsersProvider />,
  <CurrentUserProvider reducer={reducer} initialState={initialState} />,
];
