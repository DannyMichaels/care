import { createContext, useState, useContext } from 'react';

const DateContext = createContext();

export function DateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toLocaleDateString('en-CA')
  );
  const [showAllDates, setShowAllDates] = useState(false);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, showAllDates, setShowAllDates }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  return useContext(DateContext);
}
