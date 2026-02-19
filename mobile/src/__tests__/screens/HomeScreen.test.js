import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from '../../screens/main/HomeScreen';

jest.mock('@care/shared', () => ({
  getAllMeds: jest.fn().mockResolvedValue([]),
  getAllMoods: jest.fn().mockResolvedValue([]),
  getAllFoods: jest.fn().mockResolvedValue([]),
  getAllSymptoms: jest.fn().mockResolvedValue([]),
  getAllAffirmations: jest.fn().mockResolvedValue([]),
  filterByDate: jest.fn().mockReturnValue([]),
}));

jest.mock('../../context/CurrentUserContext', () => ({
  useCurrentUser: () => [{ currentUser: { id: 1, name: 'Test User' } }, jest.fn()],
}));

jest.mock('../../context/DateContext', () => ({
  useDate: () => ({
    selectedDate: '2026-02-17',
    showAllDates: false,
    setSelectedDate: jest.fn(),
    toggleShowAll: jest.fn(),
  }),
}));

jest.mock('../../components/DateCarousel', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>DateCarousel</Text></View>;
});

const mockNavigation = {
  navigate: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
};

const renderWithProvider = (component) =>
  render(<PaperProvider>{component}</PaperProvider>);

describe('HomeScreen', () => {
  it('renders greeting with user name', () => {
    const { getByText } = renderWithProvider(
      <HomeScreen navigation={mockNavigation} />
    );

    expect(getByText(/Test User/)).toBeTruthy();
  });

  it('renders accordion sections', () => {
    const { getByText } = renderWithProvider(
      <HomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Medications')).toBeTruthy();
    expect(getByText('Moods')).toBeTruthy();
    expect(getByText('Symptoms')).toBeTruthy();
    expect(getByText('Diet')).toBeTruthy();
    expect(getByText('Affirmations')).toBeTruthy();
  });
});
