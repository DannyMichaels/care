import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import SchedulePicker from '../../components/SchedulePicker';

jest.mock('../../components/DatePickerModal', () => {
  return () => null;
});

const renderWithProvider = (component) =>
  render(<PaperProvider>{component}</PaperProvider>);

describe('SchedulePicker', () => {
  const defaultProps = {
    unit: null,
    interval: null,
    endDate: null,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders schedule label', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker {...defaultProps} />
    );
    expect(getByText('Schedule')).toBeTruthy();
  });

  it('renders one-time and recurring toggle', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker {...defaultProps} />
    );
    expect(getByText('One-time')).toBeTruthy();
    expect(getByText('Recurring')).toBeTruthy();
  });

  it('does not show schedule options when one-time', () => {
    const { queryByText } = renderWithProvider(
      <SchedulePicker {...defaultProps} />
    );
    expect(queryByText('Simple')).toBeNull();
    expect(queryByText('Daily')).toBeNull();
  });

  it('shows preset chips when scheduled in simple mode', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate={null} onChange={jest.fn()} />
    );
    expect(getByText('Simple')).toBeTruthy();
    expect(getByText('Advanced')).toBeTruthy();
    expect(getByText('Daily')).toBeTruthy();
    expect(getByText('Weekly')).toBeTruthy();
    expect(getByText('Biweekly')).toBeTruthy();
    expect(getByText('Monthly')).toBeTruthy();
  });

  it('calls onChange when switching to recurring', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProvider(
      <SchedulePicker {...defaultProps} onChange={onChange} />
    );
    fireEvent.press(getByText('Recurring'));
    expect(onChange).toHaveBeenCalledWith({ unit: 'day', interval: 1, endDate: null });
  });

  it('calls onChange when switching to one-time', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate={null} onChange={onChange} />
    );
    fireEvent.press(getByText('One-time'));
    expect(onChange).toHaveBeenCalledWith({ unit: null, interval: null, endDate: null });
  });

  it('calls onChange with preset values when chip is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate={null} onChange={onChange} />
    );
    fireEvent.press(getByText('Weekly'));
    expect(onChange).toHaveBeenCalledWith({ unit: 'week', interval: 1, endDate: null });
  });

  it('calls onChange with biweekly preset', () => {
    const onChange = jest.fn();
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate={null} onChange={onChange} />
    );
    fireEvent.press(getByText('Biweekly'));
    expect(onChange).toHaveBeenCalledWith({ unit: 'week', interval: 2, endDate: null });
  });

  it('shows description text for schedule', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="week" interval={2} endDate={null} onChange={jest.fn()} />
    );
    expect(getByText('Biweekly')).toBeTruthy();
  });

  it('shows end date when set', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate="2026-03-01" onChange={jest.fn()} />
    );
    expect(getByText('Ends 2026-03-01')).toBeTruthy();
  });

  it('shows set end date button when no end date', () => {
    const { getByText } = renderWithProvider(
      <SchedulePicker unit="day" interval={1} endDate={null} onChange={jest.fn()} />
    );
    expect(getByText('Set end date')).toBeTruthy();
  });
});
