import reducer, { initialState } from '../../reducers/currentUserReducer';

describe('currentUserReducer', () => {
  it('has correct initial state', () => {
    expect(initialState).toEqual({ currentUser: null });
  });

  it('handles SET_USER', () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com' };
    const newState = reducer(initialState, { type: 'SET_USER', currentUser: user });

    expect(newState.currentUser).toEqual(user);
  });

  it('handles EDIT_USER', () => {
    const state = { currentUser: { id: 1, name: 'Old' } };
    const updated = { id: 1, name: 'Updated' };
    const newState = reducer(state, { type: 'EDIT_USER', currentUser: updated });

    expect(newState.currentUser).toEqual(updated);
  });

  it('handles REMOVE_USER', () => {
    const state = { currentUser: { id: 1, name: 'Test' } };
    const newState = reducer(state, { type: 'REMOVE_USER' });

    expect(newState.currentUser).toBeNull();
  });

  it('returns current state for unknown action', () => {
    const state = { currentUser: { id: 1 } };
    const newState = reducer(state, { type: 'UNKNOWN' });

    expect(newState).toBe(state);
  });
});
