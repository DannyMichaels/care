import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CurrentUserProvider, useCurrentUser } from '../../context/CurrentUserContext';

describe('CurrentUserContext', () => {
  const wrapper = ({ children }) => (
    <CurrentUserProvider>{children}</CurrentUserProvider>
  );

  it('provides initial state with null user', () => {
    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    expect(result.current[0].currentUser).toBeNull();
  });

  it('handles SET_USER action', () => {
    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    act(() => {
      result.current[1]({ type: 'SET_USER', currentUser: { id: 1, name: 'Test' } });
    });

    expect(result.current[0].currentUser).toEqual({ id: 1, name: 'Test' });
  });

  it('handles REMOVE_USER action', () => {
    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    act(() => {
      result.current[1]({ type: 'SET_USER', currentUser: { id: 1, name: 'Test' } });
    });

    act(() => {
      result.current[1]({ type: 'REMOVE_USER' });
    });

    expect(result.current[0].currentUser).toBeNull();
  });
});
