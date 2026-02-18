import { daysBetween, toDateTimeLocal, selectedDateToLocal, filterByDate } from '../../utils/dateUtils';

describe('dateUtils', () => {
  describe('daysBetween', () => {
    it('returns 0 for the same date', () => {
      const d = new Date('2026-01-01');
      expect(daysBetween(d, d)).toBe(0);
    });

    it('returns correct number of days', () => {
      const a = new Date('2026-01-01');
      const b = new Date('2026-01-10');
      expect(daysBetween(a, b)).toBe(9);
    });

    it('returns negative for reversed dates', () => {
      const a = new Date('2026-01-10');
      const b = new Date('2026-01-01');
      expect(daysBetween(a, b)).toBe(-9);
    });
  });

  describe('toDateTimeLocal', () => {
    it('converts a date to datetime-local format', () => {
      const result = toDateTimeLocal('2026-03-15T14:30:00');
      expect(result).toMatch(/^2026-03-15T\d{2}:\d{2}$/);
    });

    it('returns empty string for invalid date', () => {
      expect(toDateTimeLocal('invalid')).toBe('');
    });
  });

  describe('selectedDateToLocal', () => {
    it('appends current time to selected date', () => {
      const result = selectedDateToLocal('2026-02-17');
      expect(result).toMatch(/^2026-02-17T\d{2}:\d{2}$/);
    });
  });

  describe('filterByDate', () => {
    const items = [
      { id: 1, time: '2026-02-17T10:00:00' },
      { id: 2, time: '2026-02-18T10:00:00' },
      { id: 3, time: '2026-02-17T15:00:00' },
    ];

    it('returns all items when showAllDates is true', () => {
      const result = filterByDate(items, '2026-02-17', true);
      expect(result).toHaveLength(3);
    });

    it('filters items by selected date', () => {
      const result = filterByDate(items, '2026-02-17', false);
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.id)).toEqual([1, 3]);
    });

    it('handles date-only strings', () => {
      const dateItems = [
        { id: 1, affirmation_date: '2026-02-17' },
        { id: 2, affirmation_date: '2026-02-18' },
      ];
      const result = filterByDate(dateItems, '2026-02-17', false, 'affirmation_date');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('skips items without the date field', () => {
      const result = filterByDate([{ id: 1 }], '2026-02-17', false);
      expect(result).toHaveLength(0);
    });
  });
});
