import Meds from "../components/MedComponents/Meds.jsx";
import { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { destroyMed, postMed, putMed, getAllMeds, getRXGuideMeds, filterByDate } from '@care/shared';
import { DateContext } from "../context/DateContext";

export default function MedsContainer({ onFilteredCount, createOpen, onCloseCreate, optionsOpen }) {
  const { selectedDate, showAllDates } = useContext(DateContext);
  const [updated, setUpdated] = useState(false);
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

  useEffect(() => {
    const fetchMeds = async () => {
      const medData = await getAllMeds();
      setMeds(medData);
      setLoaded(true);
    };
    fetchMeds();
  }, []);

  const handleCreate = async (medData) => {
    const newMed = await postMed(medData);
    setMeds((prevState) => [...prevState, newMed]);
  };

  const handleUpdate = async (id, medData) => {
    const updatedMed = await putMed(id, medData);
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

  const filteredMeds = useMemo(
    () => filterByDate(meds, selectedDate, showAllDates, "time"),
    [meds, selectedDate, showAllDates]
  );

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
      />
    </>
  );
}
