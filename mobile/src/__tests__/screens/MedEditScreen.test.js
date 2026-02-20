import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import MedEditScreen from '../../screens/main/MedEditScreen';

const mockPutMed = jest.fn().mockResolvedValue({});
const mockDestroyMed = jest.fn().mockResolvedValue({});
const mockCreateOccurrence = jest.fn().mockResolvedValue({});
const mockUpdateOccurrence = jest.fn().mockResolvedValue({});
const mockDeleteOccurrence = jest.fn().mockResolvedValue({});

jest.mock('@care/shared', () => ({
  putMed: (...args) => mockPutMed(...args),
  destroyMed: (...args) => mockDestroyMed(...args),
  createOccurrence: (...args) => mockCreateOccurrence(...args),
  updateOccurrence: (...args) => mockUpdateOccurrence(...args),
  deleteOccurrence: (...args) => mockDeleteOccurrence(...args),
  isScheduledMed: (med) => !!med.schedule_unit,
  MED_ICONS: ['pill', 'needle'],
  MED_COLORS: ['#7E57C2'],
  MED_ICON_DISPLAY_MAP: { pill: 'pill', needle: 'needle' },
  DEFAULT_ICON: 'pill',
  DEFAULT_COLOR: '#7E57C2',
  getApiError: (err) => err?.message || 'Error',
}));

jest.mock('../../context/DateContext', () => ({
  useDate: () => ({
    selectedDate: '2026-02-19',
    setSelectedDate: jest.fn(),
  }),
}));

jest.mock('../../components/DatePickerModal', () => () => null);
jest.mock('../../components/MedicationSuggestions', () => {
  const { TextInput } = require('react-native-paper');
  return ({ name, onNameChange }) => (
    <TextInput label="Name" value={name} onChangeText={onNameChange} testID="med-name" />
  );
});
jest.mock('../../components/SchedulePicker', () => {
  const { Button } = require('react-native-paper');
  return ({ onChange }) => (
    <Button testID="clear-schedule" onPress={() => onChange({ unit: null, interval: null, endDate: null })}>
      Clear Schedule
    </Button>
  );
});

const mockNavigation = {
  goBack: jest.fn(),
};

const renderWithProvider = (component) =>
  render(<PaperProvider>{component}</PaperProvider>);

const baseMed = {
  id: 1,
  name: 'Aspirin',
  reason: 'Headache',
  medication_class: '',
  time: '2026-02-17T09:00:00Z',
  icon: 'pill',
  icon_color: '#7E57C2',
  is_taken: false,
  schedule_unit: null,
  schedule_interval: null,
  schedule_end_date: null,
  skipped: false,
};

const scheduledMed = {
  ...baseMed,
  schedule_unit: 'day',
  schedule_interval: 1,
};

describe('MedEditScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('skip button', () => {
    it('shows Skip button for one-time meds that are not skipped', () => {
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: baseMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText('Skip')).toBeTruthy();
    });

    it('shows Skip button for scheduled meds that are not skipped', () => {
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: scheduledMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText('Skip')).toBeTruthy();
    });

    it('hides Skip button when occurrence is already skipped', () => {
      const { queryByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: scheduledMed, occurrence: { id: 10, skipped: true } } }}
          navigation={mockNavigation}
        />
      );

      expect(queryByText('Skip')).toBeNull();
    });

    it('hides Skip button when one-time med is already skipped', () => {
      const skippedMed = { ...baseMed, skipped: true };
      const { queryByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: skippedMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(queryByText('Skip')).toBeNull();
    });
  });

  describe('skipped chip (unskip)', () => {
    it('shows unskip chip for skipped scheduled med', () => {
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: scheduledMed, occurrence: { id: 10, skipped: true } } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText(/Skipped/)).toBeTruthy();
    });

    it('shows unskip chip for skipped one-time med', () => {
      const skippedMed = { ...baseMed, skipped: true };
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: skippedMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText(/Skipped/)).toBeTruthy();
    });

    it('calls deleteOccurrence when unskipping a scheduled med', async () => {
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: scheduledMed, occurrence: { id: 10, skipped: true } } }}
          navigation={mockNavigation}
        />
      );

      fireEvent.press(getByText(/Skipped/));

      await waitFor(() => {
        expect(mockDeleteOccurrence).toHaveBeenCalledWith(1, 10);
      });
    });

    it('calls putMed with skipped:false when unskipping a one-time med', async () => {
      const skippedMed = { ...baseMed, skipped: true };
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: skippedMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      fireEvent.press(getByText(/Skipped/));

      await waitFor(() => {
        expect(mockPutMed).toHaveBeenCalledWith(1, { skipped: false });
      });
    });
  });

  describe('schedule conversion', () => {
    it('shows conversion Alert when changing scheduled to one-time', () => {
      jest.spyOn(Alert, 'alert');

      const { getByText, getByTestId } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: scheduledMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      fireEvent.press(getByTestId('clear-schedule'));
      fireEvent.press(getByText('Save'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Convert to One-Time',
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Keep history' }),
          expect.objectContaining({ text: 'Delete all' }),
        ])
      );
    });

    it('does not show conversion Alert for regular updates', () => {
      jest.spyOn(Alert, 'alert');

      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: baseMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      fireEvent.press(getByText('Save'));

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockPutMed).toHaveBeenCalled();
    });
  });

  describe('mark as taken', () => {
    it('shows Mark as Taken button for non-taken, non-skipped med', () => {
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: baseMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText('Mark as Taken')).toBeTruthy();
    });

    it('shows Taken chip for taken med', () => {
      const takenMed = { ...baseMed, is_taken: true };
      const { getByText } = renderWithProvider(
        <MedEditScreen
          route={{ params: { id: 1, item: takenMed, occurrence: null } }}
          navigation={mockNavigation}
        />
      );

      expect(getByText('Taken')).toBeTruthy();
    });
  });
});
