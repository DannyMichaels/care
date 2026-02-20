import React from "react";
import Symptoms from "../components/SymptomComponents/Symptoms.jsx";
import { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { destroySymptom, getAllSymptoms, postSymptom, putSymptom, filterByDate } from '@care/shared';
import { CurrentUserContext } from "../context/CurrentUserContext";
import { DateContext } from "../context/DateContext";

export default function SymptomsContainer({ onFilteredCount, createOpen, onCloseCreate, optionsOpen }) {
  const [currentUser] = useContext(CurrentUserContext);
  const { selectedDate, showAllDates } = useContext(DateContext);
  const [symptoms, setSymptoms] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchSymptoms = async () => {
      const symptomData = await getAllSymptoms();
      setSymptoms(symptomData);
      setLoaded(true);
    };
    fetchSymptoms();
  }, [currentUser]);

  const handleCreate = async (symptomData) => {
    const newSymptom = await postSymptom(symptomData);
    setSymptoms((prevState) => [...prevState, newSymptom]);
  };

  const handleUpdate = async (id, symptomData) => {
    const updatedSymptom = await putSymptom(id, symptomData);
    setSymptoms((prevState) =>
      prevState.map((symptom) => {
        return symptom.id === Number(id) ? updatedSymptom : symptom;
      })
    );
    setUpdated(true);
    history.push("/");
  };

  const handleDelete = async (id) => {
    await destroySymptom(id);
    setSymptoms((prevState) =>
      prevState.filter((symptom) => symptom.id !== id)
    );
  };

  const filteredSymptoms = useMemo(
    () => filterByDate(symptoms, selectedDate, showAllDates, "time"),
    [symptoms, selectedDate, showAllDates]
  );

  useEffect(() => {
    onFilteredCount?.(filteredSymptoms.length);
  }, [filteredSymptoms.length, onFilteredCount]);

  return (
    <>
      <Symptoms
        symptoms={filteredSymptoms}
        updated={updated}
        setSymptoms={setSymptoms}
        loaded={loaded}
        handleUpdate={handleUpdate}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        createOpen={createOpen}
        onCloseCreate={onCloseCreate}
        optionsOpen={optionsOpen}
      />
    </>
  );
}
