import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import RegisterScreen from '../../screens/auth/RegisterScreen';

jest.mock('@care/shared', () => ({
  registerUser: jest.fn(),
  sendVerificationCode: jest.fn(),
}));

jest.mock('../../context/CurrentUserContext', () => ({
  useCurrentUser: () => [{ currentUser: null }, jest.fn()],
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithProvider = (component) =>
  render(<PaperProvider>{component}</PaperProvider>);

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form', () => {
    const { getByText } = renderWithProvider(
      <RegisterScreen navigation={mockNavigation} />
    );

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Password')).toBeTruthy();
  });

  it('renders sign up button', () => {
    const { getByText } = renderWithProvider(
      <RegisterScreen navigation={mockNavigation} />
    );

    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('navigates to login screen', () => {
    const { getByText } = renderWithProvider(
      <RegisterScreen navigation={mockNavigation} />
    );

    fireEvent.press(getByText('Already have an account? Sign In'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
  });
});
