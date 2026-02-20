import React from "react";
import Foods from "../components/FoodComponents/Foods.jsx";
import { useState, useEffect, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { destroyFood, getAllFoods, postFood, putFood, filterByDate } from '@care/shared';
import { CurrentUserContext } from "../context/CurrentUserContext";
import { DateContext } from "../context/DateContext";

export default function FoodsContainer({ onFilteredCount, createOpen, onCloseCreate, optionsOpen }) {
  const [currentUser] = useContext(CurrentUserContext);
  const { selectedDate } = useContext(DateContext);
  const [foods, setFoods] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchFoods = async () => {
      const foodData = await getAllFoods();
      setFoods(foodData);
      setLoaded(true);
    };
    fetchFoods();
  }, [currentUser]);

  const handleCreate = async (foodData) => {
    const newFood = await postFood(foodData);
    setFoods((prevState) => [...prevState, newFood]);
  };

  const handleUpdate = async (id, foodData) => {
    const updatedFood = await putFood(id, foodData);
    setFoods((prevState) =>
      prevState.map((food) => {
        return food.id === Number(id) ? updatedFood : food;
      })
    );
    setUpdated(true);
    history.push("/");
  };

  const handleDelete = async (id) => {
    await destroyFood(id);
    setFoods((prevState) => prevState.filter((food) => food.id !== id));
  };

  const filteredFoods = useMemo(
    () => filterByDate(foods, selectedDate, "time"),
    [foods, selectedDate]
  );

  useEffect(() => {
    onFilteredCount?.(filteredFoods.length);
  }, [filteredFoods.length, onFilteredCount]);

  return (
    <Foods
      foods={filteredFoods}
      setFoods={setFoods}
      handleUpdate={handleUpdate}
      updated={updated}
      loaded={loaded}
      handleCreate={handleCreate}
      handleDelete={handleDelete}
      createOpen={createOpen}
      onCloseCreate={onCloseCreate}
      optionsOpen={optionsOpen}
    />
  );
}
