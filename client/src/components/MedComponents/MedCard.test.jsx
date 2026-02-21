import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MedCard from './MedCard';

const mockCreateOccurrence = jest.fn().mockResolvedValue({});
const mockDeleteOccurrence = jest.fn().mockResolvedValue({});
const mockDeleteUntakenOccurrences = jest.fn().mockResolvedValue({ deleted: 2 });

jest.mock('@care/shared', () => ({
  compareDateWithCurrentTime: () => 1,
  isScheduledMed: (med) => !!med.schedule_unit,
  getEffectiveTime: (med) => med.time,
  createOccurrence: (...args) => mockCreateOccurrence(...args),
  deleteOccurrence: (...args) => mockDeleteOccurrence(...args),
  deleteUntakenOccurrences: (...args) => mockDeleteUntakenOccurrences(...args),
}));

const theme = createMuiTheme({
  custom: {
    glass: {
      background: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      hoverBorder: '1px solid rgba(0, 0, 0, 0.12)',
      hoverShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    },
  },
});

const baseMed = {
  id: 1,
  name: 'Aspirin',
  reason: 'Headache',
  time: '2026-02-19T09:00:00Z',
  icon: 'pill',
  icon_color: '#7E57C2',
  is_taken: false,
  skipped: false,
  schedule_unit: null,
  schedule_interval: null,
};

const scheduledMed = {
  ...baseMed,
  time: '2026-02-17T09:00:00Z',
  schedule_unit: 'day',
  schedule_interval: 1,
};

const defaultProps = {
  meds: [baseMed],
  setMeds: jest.fn(),
  handleUpdate: jest.fn().mockResolvedValue({}),
  handleDelete: jest.fn().mockResolvedValue(),
  openOptions: false,
  RXGuideMeds: [],
  occurrences: [],
  selectedDate: '2026-02-19',
  onOccurrenceChange: jest.fn(),
};

const renderCard = (props = {}) => {
  const merged = { ...defaultProps, ...props };
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/']}>
        <MedCard {...merged} med={merged.med || baseMed} />
      </MemoryRouter>
    </ThemeProvider>
  );
};

// Helper: click the delete icon button (visible when openOptions=true)
const clickDeleteIcon = () => {
  const buttons = screen.getAllByRole('button');
  // Delete icon is the last button in the card actions
  const deleteBtn = buttons.find((btn) => btn.querySelector('svg[class*="MuiSvgIcon"]'));
  // Just click the last small icon button
  fireEvent.click(buttons[buttons.length - 1]);
};

describe('MedCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('skipped display', () => {
    it('shows skipped message for skipped one-time med', () => {
      const skippedMed = { ...baseMed, skipped: true };
      renderCard({ med: skippedMed });

      expect(screen.getByText(/skipped for today/)).toBeInTheDocument();
    });

    it('shows skipped message for skipped scheduled med', () => {
      const skippedOcc = {
        id: 10,
        medication_id: scheduledMed.id,
        occurrence_date: '2026-02-19',
        skipped: true,
        is_taken: false,
      };
      renderCard({
        med: { ...scheduledMed, occurrence: skippedOcc },
        meds: [scheduledMed],
      });

      expect(screen.getByText(/skipped for today/)).toBeInTheDocument();
    });

    it('shows normal status for non-skipped med', () => {
      renderCard({ med: baseMed });

      expect(screen.queryByText(/skipped/i)).not.toBeInTheDocument();
    });
  });

  describe('taken display', () => {
    it('shows taken message for taken one-time med', () => {
      const takenMed = { ...baseMed, is_taken: true, taken_date: '2026-02-19T10:00:00Z' };
      renderCard({ med: takenMed });

      expect(screen.getByText(/You took Aspirin/)).toBeInTheDocument();
    });

    it('does not show taken when med is skipped', () => {
      const skippedTakenMed = { ...baseMed, is_taken: true, skipped: true };
      renderCard({ med: skippedTakenMed });

      expect(screen.queryByText(/You took/)).not.toBeInTheDocument();
      expect(screen.getByText(/skipped for today/)).toBeInTheDocument();
    });
  });

  describe('detail dialog', () => {
    it('opens detail dialog on click', () => {
      renderCard({ med: baseMed });

      fireEvent.click(screen.getByText('Aspirin'));

      expect(screen.getByText(/Did you take Aspirin/)).toBeInTheDocument();
    });

    it('shows Skip button in detail for non-skipped med', () => {
      renderCard({ med: baseMed });
      fireEvent.click(screen.getByText('Aspirin'));

      expect(screen.getByText('Skip')).toBeInTheDocument();
    });

    it('shows Unskip button in detail for skipped med', () => {
      const skippedMed = { ...baseMed, skipped: true };
      renderCard({ med: skippedMed });
      fireEvent.click(screen.getByText('Aspirin'));

      expect(screen.getByText('Unskip')).toBeInTheDocument();
    });
  });

  describe('delete dialog', () => {
    it('shows simple confirmation for one-time med', () => {
      renderCard({ med: baseMed, openOptions: true });
      clickDeleteIcon();

      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      expect(screen.queryByText('Skip this day')).not.toBeInTheDocument();
    });

    it('shows 3 options for scheduled med', () => {
      renderCard({ med: scheduledMed, meds: [scheduledMed], openOptions: true });
      clickDeleteIcon();

      expect(screen.getByText(/What would you like to do/)).toBeInTheDocument();
      expect(screen.getByText('Skip this day')).toBeInTheDocument();
      expect(screen.getByText('Delete untaken occurrences')).toBeInTheDocument();
      expect(screen.getByText('Delete medication')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls handleDelete when confirming delete for one-time med', async () => {
      const handleDelete = jest.fn().mockResolvedValue();
      renderCard({ med: baseMed, handleDelete, openOptions: true });
      clickDeleteIcon();

      // Click the Delete button in the confirmation dialog
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => {
        expect(handleDelete).toHaveBeenCalledWith(1);
      });
    });

    it('calls deleteUntakenOccurrences for scheduled med', async () => {
      renderCard({ med: scheduledMed, meds: [scheduledMed], openOptions: true });
      clickDeleteIcon();
      fireEvent.click(screen.getByText('Delete untaken occurrences'));

      await waitFor(() => {
        expect(mockDeleteUntakenOccurrences).toHaveBeenCalledWith(1);
      });
    });

    it('calls createOccurrence with skipped when Skip this day is clicked', async () => {
      renderCard({ med: scheduledMed, meds: [scheduledMed], openOptions: true });
      clickDeleteIcon();
      fireEvent.click(screen.getByText('Skip this day'));

      await waitFor(() => {
        expect(mockCreateOccurrence).toHaveBeenCalledWith(1, {
          occurrence_date: '2026-02-19',
          skipped: true,
        });
      });
    });

    it('closes dialog on Cancel', async () => {
      renderCard({ med: scheduledMed, meds: [scheduledMed], openOptions: true });
      clickDeleteIcon();

      expect(screen.getByText('Skip this day')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Skip this day')).not.toBeInTheDocument();
      });
    });
  });
});
