import Meds from "../components/MedComponents/Meds.jsx";
import { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { destroyMed, postMed, putMed, getAllMeds, getRXGuideMeds, getBatchOccurrences, filterByDate, isScheduledMed, doesOccurOnDate } from '@care/shared';
import { DateContext } from "../context/DateContext";

export default function MedsContainer({ onFilteredCount, createOpen, onCloseCreate, optionsOpen }) {
  const { selectedDate, showAllDates } = useContext(DateContext);
  const [updated, setUpdated] = useState(false);
  const [meds, setMeds] = useState([]);
  const [RXGuideMeds, setRXGuideMeds] = useState([]);
  const [occurrences, setOccurrences] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const getAirtableApi = async () => {
      const RXGMeds = await getRXGuideMeds();
      setRXGuideMeds(RXGMeds);
    };
    getAirtableApi();
  }, []);

  useEffect(() => {
    const fetchMeds = async () => {
      const medData = await getAllMeds();
      setMeds(medData);
      setLoaded(true);
    };
    fetchMeds();
  }, []);

  useEffect(() => {
    const hasScheduled = meds.some(isScheduledMed);
    if (!hasScheduled) {
      setOccurrences([]);
      return;
    }
    const fetchOccurrences = async () => {
      try {
        const data = await getBatchOccurrences(selectedDate, selectedDate);
        setOccurrences(data || []);
      } catch {}
    };
    fetchOccurrences();
  }, [selectedDate, meds]);

  const handleCreate = async (medData) => {
    const newMed = await postMed(medData);
    setMeds((prevState) => [...prevState, newMed]);
  };

  const handleUpdate = async (id, medData, options = {}) => {
    const updatedMed = await putMed(id, medData, options);
    setMeds((prevState) =>
      prevState.map((med) => {
        return med.id === Number(id) ? updatedMed : med;
      })
    );
    setUpdated(true);
    history.push("/");
  };

  const handleDelete = async (id) => {
    await destroyMed(id);
    setMeds((prevState) =>
      prevState.filter((affirmation) => affirmation.id !== id)
    );
  };

  const filteredMeds = useMemo(() => {
    if (showAllDates) return meds;
    const oneTimeMeds = meds.filter((med) => !isScheduledMed(med));
    const scheduledMeds = meds.filter((med) => isScheduledMed(med) && doesOccurOnDate(med, selectedDate));
    const filteredOneTime = filterByDate(oneTimeMeds, selectedDate, false, "time");
    const allVisible = [...filteredOneTime, ...scheduledMeds];
    return allVisible.filter((med) => {
      if (!isScheduledMed(med)) return true;
      const occ = occurrences.find((o) => o.medication_id === med.id && o.occurrence_date === selectedDate);
      return !occ?.skipped;
    });
  }, [meds, selectedDate, showAllDates, occurrences]);

  useEffect(() => {
    onFilteredCount?.(filteredMeds.length);
  }, [filteredMeds.length, onFilteredCount]);

  return (
    <>
      <Meds
        RXGuideMeds={RXGuideMeds}
        meds={filteredMeds}
        setMeds={setMeds}
        updated={updated}
        loaded={loaded}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        createOpen={createOpen}
        onCloseCreate={onCloseCreate}
        optionsOpen={optionsOpen}
        occurrences={occurrences}
        selectedDate={selectedDate}
      />
    </>
  );
}
