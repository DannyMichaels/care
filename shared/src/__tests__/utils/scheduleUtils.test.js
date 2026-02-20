import {
  isScheduledMed,
  doesOccurOnDate,
  getOccurrencesInRange,
  getScheduleDescription,
  SCHEDULE_PRESETS,
} from '../../utils/scheduleUtils';

describe('SCHEDULE_PRESETS', () => {
  it('has 4 presets', () => {
    expect(SCHEDULE_PRESETS).toHaveLength(4);
  });

  it('includes Daily, Weekly, Biweekly, Monthly', () => {
    const labels = SCHEDULE_PRESETS.map((p) => p.label);
    expect(labels).toEqual(['Daily', 'Weekly', 'Biweekly', 'Monthly']);
  });
});

describe('isScheduledMed', () => {
  it('returns true when schedule_unit is present', () => {
    expect(isScheduledMed({ schedule_unit: 'day' })).toBe(true);
    expect(isScheduledMed({ schedule_unit: 'week' })).toBe(true);
    expect(isScheduledMed({ schedule_unit: 'month' })).toBe(true);
  });

  it('returns false when schedule_unit is null or undefined', () => {
    expect(isScheduledMed({ schedule_unit: null })).toBe(false);
    expect(isScheduledMed({})).toBe(false);
  });
});

describe('doesOccurOnDate', () => {
  const baseMed = {
    time: '2026-02-01T09:00:00.000Z',
    schedule_interval: 1,
  };

  describe('daily schedule', () => {
    const med = { ...baseMed, schedule_unit: 'day', schedule_interval: 1 };

    it('returns true for the start date', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
    });

    it('returns true for every subsequent day', () => {
      expect(doesOccurOnDate(med, '2026-02-02')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-15')).toBe(true);
      expect(doesOccurOnDate(med, '2026-03-01')).toBe(true);
    });

    it('returns false for dates before start', () => {
      expect(doesOccurOnDate(med, '2026-01-31')).toBe(false);
    });
  });

  describe('every-2-day schedule', () => {
    const med = { ...baseMed, schedule_unit: 'day', schedule_interval: 2 };

    it('returns true on even-interval days', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-03')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-05')).toBe(true);
    });

    it('returns false on odd-interval days', () => {
      expect(doesOccurOnDate(med, '2026-02-02')).toBe(false);
      expect(doesOccurOnDate(med, '2026-02-04')).toBe(false);
    });
  });

  describe('weekly schedule', () => {
    const med = { ...baseMed, schedule_unit: 'week', schedule_interval: 1 };

    it('returns true every 7 days from start', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-08')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-15')).toBe(true);
    });

    it('returns false on non-weekly dates', () => {
      expect(doesOccurOnDate(med, '2026-02-02')).toBe(false);
      expect(doesOccurOnDate(med, '2026-02-07')).toBe(false);
    });
  });

  describe('biweekly schedule', () => {
    const med = { ...baseMed, schedule_unit: 'week', schedule_interval: 2 };

    it('returns true every 14 days from start', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-02-15')).toBe(true);
      expect(doesOccurOnDate(med, '2026-03-01')).toBe(true);
    });

    it('returns false on the in-between week', () => {
      expect(doesOccurOnDate(med, '2026-02-08')).toBe(false);
      expect(doesOccurOnDate(med, '2026-02-22')).toBe(false);
    });
  });

  describe('monthly schedule', () => {
    const med = { ...baseMed, schedule_unit: 'month', schedule_interval: 1 };

    it('returns true on the same day of month each month', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-03-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-06-01')).toBe(true);
    });

    it('returns false on different days of the month', () => {
      expect(doesOccurOnDate(med, '2026-02-02')).toBe(false);
      expect(doesOccurOnDate(med, '2026-03-15')).toBe(false);
    });
  });

  describe('every-3-months schedule', () => {
    const med = { ...baseMed, schedule_unit: 'month', schedule_interval: 3 };

    it('returns true every 3 months', () => {
      expect(doesOccurOnDate(med, '2026-02-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-05-01')).toBe(true);
      expect(doesOccurOnDate(med, '2026-08-01')).toBe(true);
    });

    it('returns false on non-interval months', () => {
      expect(doesOccurOnDate(med, '2026-03-01')).toBe(false);
      expect(doesOccurOnDate(med, '2026-04-01')).toBe(false);
    });
  });

  describe('schedule_end_date', () => {
    const med = {
      ...baseMed,
      schedule_unit: 'day',
      schedule_interval: 1,
      schedule_end_date: '2026-02-10',
    };

    it('returns true before end date', () => {
      expect(doesOccurOnDate(med, '2026-02-09')).toBe(true);
    });

    it('returns true on end date', () => {
      expect(doesOccurOnDate(med, '2026-02-10')).toBe(true);
    });

    it('returns false after end date', () => {
      expect(doesOccurOnDate(med, '2026-02-11')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns false for non-scheduled meds', () => {
      expect(doesOccurOnDate({ time: '2026-02-01T09:00:00Z' }, '2026-02-01')).toBe(false);
    });

    it('returns false when time is missing', () => {
      expect(doesOccurOnDate({ schedule_unit: 'day', schedule_interval: 1 }, '2026-02-01')).toBe(false);
    });
  });
});

describe('getOccurrencesInRange', () => {
  it('returns all daily occurrences in range', () => {
    const med = {
      time: '2026-02-01T09:00:00Z',
      schedule_unit: 'day',
      schedule_interval: 1,
    };
    const result = getOccurrencesInRange(med, '2026-02-01', '2026-02-05');
    expect(result).toEqual([
      '2026-02-01',
      '2026-02-02',
      '2026-02-03',
      '2026-02-04',
      '2026-02-05',
    ]);
  });

  it('returns weekly occurrences in range', () => {
    const med = {
      time: '2026-02-01T09:00:00Z',
      schedule_unit: 'week',
      schedule_interval: 1,
    };
    const result = getOccurrencesInRange(med, '2026-02-01', '2026-02-28');
    expect(result).toEqual([
      '2026-02-01',
      '2026-02-08',
      '2026-02-15',
      '2026-02-22',
    ]);
  });

  it('returns empty array for non-scheduled med', () => {
    const med = { time: '2026-02-01T09:00:00Z' };
    expect(getOccurrencesInRange(med, '2026-02-01', '2026-02-28')).toEqual([]);
  });

  it('respects end date', () => {
    const med = {
      time: '2026-02-01T09:00:00Z',
      schedule_unit: 'day',
      schedule_interval: 1,
      schedule_end_date: '2026-02-03',
    };
    const result = getOccurrencesInRange(med, '2026-02-01', '2026-02-10');
    expect(result).toEqual(['2026-02-01', '2026-02-02', '2026-02-03']);
  });
});

describe('getScheduleDescription', () => {
  it('returns "Daily" for 1 day', () => {
    expect(getScheduleDescription('day', 1)).toBe('Daily');
  });

  it('returns "Weekly" for 1 week', () => {
    expect(getScheduleDescription('week', 1)).toBe('Weekly');
  });

  it('returns "Monthly" for 1 month', () => {
    expect(getScheduleDescription('month', 1)).toBe('Monthly');
  });

  it('returns "Biweekly" for 2 weeks', () => {
    expect(getScheduleDescription('week', 2)).toBe('Biweekly');
  });

  it('returns "Every 3 days" for 3 day', () => {
    expect(getScheduleDescription('day', 3)).toBe('Every 3 days');
  });

  it('returns "Every 4 weeks" for 4 week', () => {
    expect(getScheduleDescription('week', 4)).toBe('Every 4 weeks');
  });

  it('returns "Every 3 months" for 3 month', () => {
    expect(getScheduleDescription('month', 3)).toBe('Every 3 months');
  });

  it('returns empty string for null values', () => {
    expect(getScheduleDescription(null, null)).toBe('');
    expect(getScheduleDescription('day', null)).toBe('');
    expect(getScheduleDescription(null, 1)).toBe('');
  });
});
