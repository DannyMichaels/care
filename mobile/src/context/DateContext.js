import { createContext, useContext, useState, useCallback } from 'react';
import dayjs from 'dayjs';

const DateContext = createContext();

export function DateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toLocaleDateString('en-CA')
  );

  const getSelectedDateWithTime = useCallback((time) => {
    return dayjs(selectedDate).hour(time.getHours()).minute(time.getMinutes()).second(0).toISOString();
  }, [selectedDate]);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, getSelectedDateWithTime }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  return useContext(DateContext);
}
