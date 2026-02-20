import React, { useState, createContext } from "react";

const DateContext = createContext();

function DateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toLocaleDateString("en-CA") // "YYYY-MM-DD" in local timezone
  );

  return (
    <DateContext.Provider
      value={{ selectedDate, setSelectedDate }}
    >
      {children}
    </DateContext.Provider>
  );
}

export { DateContext, DateProvider };
