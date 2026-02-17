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
  return items.filter((item) => {
    const val = item[dateField];
    if (!val) return false;
    // If value is already "YYYY-MM-DD" (e.g. affirmation_date), compare directly
    // to avoid UTC timezone bugs from new Date("YYYY-MM-DD")
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val === selectedDate;
    }
    return new Date(val).toLocaleDateString("en-CA") === selectedDate;
  });
}
