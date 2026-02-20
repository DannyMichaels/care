export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

export function toDateTimeLocal(date) {
  const d = new Date(date);
  if (isNaN(d)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function selectedDateToLocal(selectedDate) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${selectedDate}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function buildCalendarDays(selectedDate, futureDays = 90) {
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setDate(defaultStart.getDate() - 365);

  const selectedStart = new Date(selectedDate + 'T00:00:00');
  const earliest = selectedStart < defaultStart ? selectedStart : defaultStart;
  const totalPast = daysBetween(earliest, now);

  const days = [];
  for (let i = totalPast; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      dateStr: d.toLocaleDateString('en-CA'),
      dayOfWeek: SHORT_DAYS[d.getDay()],
      dayOfMonth: d.getDate(),
      month: SHORT_MONTHS[d.getMonth()],
      year: d.getFullYear(),
      isToday: i === 0,
    });
  }
  for (let i = 1; i <= futureDays; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toLocaleDateString('en-CA'),
      dayOfWeek: SHORT_DAYS[d.getDay()],
      dayOfMonth: d.getDate(),
      month: SHORT_MONTHS[d.getMonth()],
      year: d.getFullYear(),
      isToday: false,
    });
  }
  return days;
}

export function filterByDate(items, selectedDate, dateField = 'time') {
  return items.filter((item) => {
    const val = item[dateField];
    if (!val) return false;
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val === selectedDate;
    }
    return new Date(val).toLocaleDateString('en-CA') === selectedDate;
  });
}
