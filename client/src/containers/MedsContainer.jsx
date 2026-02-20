import Meds from '../components/MedComponents/Meds.jsx';
import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { destroyMed, postMed, putMed, getDashboardMeds, getRXGuideMeds, filterByDate, isScheduledMed, doesOccurOnDate } from '@care/shared';
import { DateContext } from '../context/DateContext';

export default function MedsContainer({ onFilteredCount, createOpen, onCloseCreate, optionsOpen }) {
  const { selectedDate } = useContext(DateContext);
  const [meds, setMeds] = useState([]);
  const [RXGuideMeds, setRXGuideMeds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getAirtableApi = async () => {
      const RXGMeds = await getRXGuideMeds();
      setRXGuideMeds(RXGMeds);
    };
    getAirtableApi();
  }, []);

  const fetchMeds = useCallback(async () => {
    const data = await getDashboardMeds(selectedDate);
    setMeds(data || []);
    setLoaded(true);
  }, [selectedDate]);

  useEffect(() => { fetchMeds(); }, [fetchMeds]);

  const handleCreate = async (medData) => {
    const newMed = await postMed(medData);
    setMeds((prevState) => [...prevState, { ...newMed, occurrence: null }]);
  };

  const handleUpdate = async (id, medData, options = {}) => {
    const updatedMed = await putMed(id, medData, options);
    setMeds((prev) =>
      prev.map((med) =>
        med.id === Number(id) ? { ...updatedMed, occurrence: med.occurrence } : med
      )
    );
    history.push('/');
  };

  const handleDelete = async (id) => {
    await destroyMed(id);
    setMeds((prevState) =>
      prevState.filter((affirmation) => affirmation.id !== id)
    );
  };

  const filteredMeds = useMemo(() => {
    const oneTimeMeds = meds.filter((med) => !isScheduledMed(med));
    const scheduledMeds = meds.filter((med) => isScheduledMed(med) && doesOccurOnDate(med, selectedDate));
    const filteredOneTime = filterByDate(oneTimeMeds, selectedDate, 'time');
    return [...filteredOneTime, ...scheduledMeds];
  }, [meds, selectedDate]);

  useEffect(() => {
    onFilteredCount?.(filteredMeds.length);
  }, [filteredMeds.length, onFilteredCount]);

  return (
    <>
      <Meds
        RXGuideMeds={RXGuideMeds}
        meds={filteredMeds}
        loaded={loaded}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        createOpen={createOpen}
        onCloseCreate={onCloseCreate}
        optionsOpen={optionsOpen}
        selectedDate={selectedDate}
        onOccurrenceChange={fetchMeds}
      />
    </>
  );
}
