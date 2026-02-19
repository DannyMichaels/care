import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import EmailVerificationScreen from '../../screens/auth/EmailVerificationScreen';

jest.mock('@care/shared', () => ({
  verifyCode: jest.fn(),
  sendVerificationCode: jest.fn(),
}));

jest.mock('../../context/CurrentUserContext', () => ({
  useCurrentUser: () => [{ currentUser: { id: 1, email: 'test@example.com' } }, jest.fn()],
}));

const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: { email: 'test@example.com' },
};

const renderWithProvider = (component) =>
  render(<PaperProvider>{component}</PaperProvider>);

describe('EmailVerificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders verification screen', () => {
    const { getByText } = renderWithProvider(
      <EmailVerificationScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Verify Your Email')).toBeTruthy();
    expect(getByText(/test@example.com/)).toBeTruthy();
  });

  it('renders verify button', () => {
    const { getByText } = renderWithProvider(
      <EmailVerificationScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Verify')).toBeTruthy();
  });

  it('renders resend code button', () => {
    const { getByText } = renderWithProvider(
      <EmailVerificationScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Resend Code')).toBeTruthy();
  });

  it('calls sendVerificationCode on resend', async () => {
    const { sendVerificationCode } = require('@care/shared');
    sendVerificationCode.mockResolvedValue({});

    const { getByText } = renderWithProvider(
      <EmailVerificationScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Resend Code'));
    expect(sendVerificationCode).toHaveBeenCalledWith('test@example.com');
  });
});
