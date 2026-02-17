import React, { useContext, useMemo, useEffect, useRef, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import EventIcon from "@material-ui/icons/Event";
import { DateContext } from "../../context/DateContext";
import { ThemeStateContext } from "../../context/ThemeStateContext";
import { daysBetween } from "../../utils/dateUtils";
import "./DateCarousel.css";

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function DateCarousel() {
  const { selectedDate, setSelectedDate, showAllDates, setShowAllDates } =
    useContext(DateContext);
  const [themeState] = useContext(ThemeStateContext);
  const stripRef = useRef(null);
  const pickerRef = useRef(null);
  const chipRefs = useRef({});
  const [visibleYear, setVisibleYear] = useState(
    () => parseInt(selectedDate.substring(0, 4), 10)
  );

  const today = useMemo(() => new Date().toLocaleDateString("en-CA"), []);

  // Extend range if selectedDate is older than 365 days back
  const dates = useMemo(() => {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 365);

    const selectedStart = new Date(selectedDate + "T00:00:00");
    const earliest = selectedStart < defaultStart ? selectedStart : defaultStart;

    const totalDays = daysBetween(earliest, now);
    const result = [];
    // Past days + today
    for (let i = totalDays; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      result.push({
        key: d.toLocaleDateString("en-CA"),
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
        key: d.toLocaleDateString("en-CA"),
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
        el.scrollIntoView({ behavior: "smooth", inline: "center" });
      } else {
        el.scrollIntoView({ inline: "center" });
        hasMounted.current = true;
      }
    }
  }, [selectedDate]);

  // Track which year is visible in the scroll strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const updateVisibleYear = () => {
      // getBoundingClientRect() returns a box describing where an element
      // sits on screen: { left, right, top, bottom, width, height }
      //
      //   left = pixels from the left edge of the viewport to the element's left side
      //   width = how wide the element is in pixels
      //
      // Example: if the strip starts at 50px from the left and is 300px wide,
      //   stripRect.left = 50, stripRect.width = 300

      const stripRect = strip.getBoundingClientRect();

      // To find the horizontal middle of the strip on screen:
      //   start at its left edge (left), then go half its width (width / 2)
      //   50 + (300 / 2) = 200px from viewport left = the strip's center
      const centerX = stripRect.left + stripRect.width / 2;

      // Now we check every chip to find which one is closest to that center point.
      // We start with "no chip found" and "infinite distance" so any real chip wins.
      let closestChip = null;
      let closestDist = Infinity;

      for (const [key, el] of Object.entries(chipRefs.current)) {
        if (!el) continue;

        // Same math for each chip — get its box, find its horizontal center
        const rect = el.getBoundingClientRect();
        const chipCenter = rect.left + rect.width / 2;

        // How far is this chip's center from the strip's center?
        // Math.abs makes it always positive (we don't care left vs right, just distance)
        const dist = Math.abs(chipCenter - centerX);

        // If this chip is closer than any we've seen so far, remember it.
        // First iteration: any distance < Infinity, so the first chip always wins.
        // After that, only a chip that's even closer can replace it.
        if (dist < closestDist) {
          closestDist = dist;
          closestChip = key; // key is "YYYY-MM-DD", e.g. "2024-03-15"
        }
      }

      // The closest chip to center is the one the user is looking at.
      // Extract the year (first 4 chars) from its date key.
      if (closestChip) {
        setVisibleYear(parseInt(closestChip.substring(0, 4), 10));
      }
    };

    strip.addEventListener("scroll", updateVisibleYear, { passive: true });
    return () => strip.removeEventListener("scroll", updateVisibleYear);
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

  const themeSuffix = themeState === "dark" ? "dark" : "light";

  return (
    <div className="date-carousel">
      <div className="date-carousel__cal" style={{ position: "relative" }}>
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
          showAllDates ? " date-carousel__strip--dimmed" : ""
        }`}
      >
        {dates.map((d) => (
          <button
            key={d.key}
            ref={(el) => (chipRefs.current[d.key] = el)}
            className={`date-carousel__chip date-carousel__chip--${themeSuffix}${
              d.key === selectedDate
                ? " date-carousel__chip--selected"
                : ""
            }${d.future ? " date-carousel__chip--future" : ""}`}
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
