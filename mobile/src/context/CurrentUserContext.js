import { createContext, useReducer, useContext } from 'react';
import currentUserReducer, { initialState } from '@care/shared/src/reducers/currentUserReducer';

const CurrentUserContext = createContext();

export function CurrentUserProvider({ children }) {
  const [state, dispatch] = useReducer(currentUserReducer, initialState);

  return (
    <CurrentUserContext.Provider value={[state, dispatch]}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}
