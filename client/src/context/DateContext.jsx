import React, { useState, createContext } from "react";

const DateContext = createContext();

function DateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toLocaleDateString("en-CA") // "YYYY-MM-DD" in local timezone
  );
  const [showAllDates, setShowAllDates] = useState(false);

  return (
    <DateContext.Provider
      value={{ selectedDate, setSelectedDate, showAllDates, setShowAllDates }}
    >
      {children}
    </DateContext.Provider>
  );
}

export { DateContext, DateProvider };
