import React, { useContext, useMemo, useEffect, useRef, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import EventIcon from '@material-ui/icons/Event';
import { useTheme } from '@material-ui/core/styles';
import { DateContext } from '../../context/DateContext';
import { daysBetween } from '@care/shared';
import './DateCarousel.css';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function DateCarousel() {
  const { selectedDate, setSelectedDate, showAllDates, setShowAllDates } =
    useContext(DateContext);
  const theme = useTheme();
  const stripRef = useRef(null);
  const pickerRef = useRef(null);
  const chipRefs = useRef({});
  const [visibleYear, setVisibleYear] = useState(
    () => parseInt(selectedDate.substring(0, 4), 10)
  );

  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

  // Extend range if selectedDate is older than 365 days back
  const dates = useMemo(() => {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 365);

    const selectedStart = new Date(selectedDate + 'T00:00:00');
    const earliest = selectedStart < defaultStart ? selectedStart : defaultStart;

    const totalDays = daysBetween(earliest, now);
    const result = [];
    // Past days + today
    for (let i = totalDays; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      result.push({
        key: d.toLocaleDateString('en-CA'),
        day: SHORT_DAYS[d.getDay()],
        num: d.getDate(),
        month: SHORT_MONTHS[d.getMonth()],
        year: d.getFullYear(),
        future: false,
      });
    }
    // Future days
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      result.push({
        key: d.toLocaleDateString('en-CA'),
        day: SHORT_DAYS[d.getDay()],
        num: d.getDate(),
        month: SHORT_MONTHS[d.getMonth()],
        year: d.getFullYear(),
        future: true,
      });
    }
    return result;
  }, [selectedDate]);

  // Scroll to selected date — instant on mount, smooth on subsequent changes
  const hasMounted = useRef(false);
  useEffect(() => {
    const el = chipRefs.current[selectedDate];
    if (el) {
      if (hasMounted.current) {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      } else {
        el.scrollIntoView({ inline: 'center' });
        hasMounted.current = true;
      }
    }
  }, [selectedDate]);

  // Track which year is visible in the scroll strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const updateVisibleYear = () => {
      const stripRect = strip.getBoundingClientRect();
      const centerX = stripRect.left + stripRect.width / 2;

      let closestChip = null;
      let closestDist = Infinity;

      for (const [key, el] of Object.entries(chipRefs.current)) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const chipCenter = rect.left + rect.width / 2;
        const dist = Math.abs(chipCenter - centerX);

        if (dist < closestDist) {
          closestDist = dist;
          closestChip = key;
        }
      }

      if (closestChip) {
        setVisibleYear(parseInt(closestChip.substring(0, 4), 10));
      }
    };

    strip.addEventListener('scroll', updateVisibleYear, { passive: true });
    return () => strip.removeEventListener('scroll', updateVisibleYear);
  }, []);

  const handleChipClick = (dateKey) => {
    if (showAllDates) setShowAllDates(false);
    setSelectedDate(dateKey);
  };

  const handleCalendarClick = () => {
    if (pickerRef.current) {
      pickerRef.current.showPicker?.();
      pickerRef.current.click();
    }
  };

  const handlePickerChange = (e) => {
    const val = e.target.value;
    if (val) {
      if (showAllDates) setShowAllDates(false);
      setSelectedDate(val);
    }
  };

  const themeSuffix = theme.palette.type === 'dark' ? 'dark' : 'light';

  return (
    <div className="date-carousel">
      <div className="date-carousel__cal" style={{ position: 'relative' }}>
        <IconButton size="small" onClick={handleCalendarClick}>
          <EventIcon />
        </IconButton>
        <input
          ref={pickerRef}
          type="date"
          className="date-carousel__picker-input"
          max={today}
          value={selectedDate}
          onChange={handlePickerChange}
        />
      </div>

      <div className="date-carousel__year">{visibleYear}</div>

      <div className="date-carousel__all-label">
        <Switch
          size="small"
          checked={showAllDates}
          onChange={(e) => setShowAllDates(e.target.checked)}
          color="primary"
        />
        All
      </div>

      <div
        ref={stripRef}
        className={`date-carousel__strip${
          showAllDates ? ' date-carousel__strip--dimmed' : ''
        }`}
      >
        {dates.map((d) => (
          <button
            key={d.key}
            ref={(el) => (chipRefs.current[d.key] = el)}
            className={`date-carousel__chip date-carousel__chip--${themeSuffix}${
              d.key === selectedDate
                ? ' date-carousel__chip--selected'
                : ''
            }${d.future ? ' date-carousel__chip--future' : ''}`}
            onClick={() => !d.future && handleChipClick(d.key)}
            disabled={d.future}
          >
            {d.key === today && (
              <span className="date-carousel__chip-today">Today</span>
            )}
            <span className="date-carousel__chip-day">{d.day}</span>
            <span className="date-carousel__chip-num">{d.num}</span>
            <span className="date-carousel__chip-month">{d.month}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
