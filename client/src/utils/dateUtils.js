export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

// Convert a Date or ISO string to "YYYY-MM-DDThh:mm" in local time
// (the format <input type="datetime-local"> expects)
export function toDateTimeLocal(date) {
  const d = new Date(date);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Build a default datetime-local value from a "YYYY-MM-DD" date string + current clock time
export function selectedDateToLocal(selectedDate) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${selectedDate}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function filterByDate(
  items,
  selectedDate,
  showAllDates,
  dateField = "time"
) {
  if (showAllDates) return items;
  return items.filter(
    (item) =>
      new Date(item[dateField]).toLocaleDateString("en-CA") === selectedDate
  );
}
