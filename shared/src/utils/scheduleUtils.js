export const SCHEDULE_PRESETS = [
  { label: 'Daily', unit: 'day', interval: 1 },
  { label: 'Weekly', unit: 'week', interval: 1 },
  { label: 'Biweekly', unit: 'week', interval: 2 },
  { label: 'Monthly', unit: 'month', interval: 1 },
];

export function isScheduledMed(med) {
  return !!med.schedule_unit;
}

export function doesOccurOnDate(med, dateStr) {
  if (!med.schedule_unit || !med.time) return false;

  const startDate = new Date(med.time);
  const startStr = startDate.toLocaleDateString('en-CA');
  const target = new Date(dateStr + 'T00:00:00');
  const start = new Date(startStr + 'T00:00:00');

  // Before start date
  if (target < start) return false;

  // After end date
  if (med.schedule_end_date) {
    const end = new Date(med.schedule_end_date + 'T00:00:00');
    if (target > end) return false;
  }

  const daysDiff = Math.round((target - start) / 86400000);

  switch (med.schedule_unit) {
    case 'day':
      return daysDiff % med.schedule_interval === 0;
    case 'week':
      return daysDiff % (med.schedule_interval * 7) === 0;
    case 'month': {
      const startDay = start.getDate();
      const targetDay = target.getDate();
      if (startDay !== targetDay) return false;
      const monthDiff =
        (target.getFullYear() - start.getFullYear()) * 12 +
        (target.getMonth() - start.getMonth());
      return monthDiff >= 0 && monthDiff % med.schedule_interval === 0;
    }
    default:
      return false;
  }
}

export function getOccurrencesInRange(med, fromDate, toDate) {
  if (!med.schedule_unit || !med.time) return [];

  const from = new Date(fromDate + 'T00:00:00');
  const to = new Date(toDate + 'T00:00:00');
  const dates = [];
  const current = new Date(from);

  while (current <= to) {
    const dateStr = current.toLocaleDateString('en-CA');
    if (doesOccurOnDate(med, dateStr)) {
      dates.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getEffectiveTime(med, selectedDate) {
  if (!isScheduledMed(med) || !selectedDate) return med.time;
  const t = new Date(med.time);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  return `${selectedDate}T${hh}:${mm}:00`;
}

export function getScheduleDescription(unit, interval) {
  if (!unit || !interval) return '';
  if (interval === 1) {
    switch (unit) {
      case 'day': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      default: return '';
    }
  }
  if (interval === 2 && unit === 'week') return 'Biweekly';
  const unitLabel = unit === 'day' ? 'days' : unit === 'week' ? 'weeks' : 'months';
  return `Every ${interval} ${unitLabel}`;
}
