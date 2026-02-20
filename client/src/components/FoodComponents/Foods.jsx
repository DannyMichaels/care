import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import FoodCard from './FoodCard';
import FoodCreate from '../Dialogs/FoodDialogs/FoodCreate';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
    },
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: theme.spacing(2),
  },
}));

export default function Foods({
  foods,
  updated,
  handleDelete,
  handleCreate,
  loaded,
  setFoods,
  handleUpdate,
  createOpen,
  onCloseCreate,
  optionsOpen,
}) {
  const classes = useStyles();

  const onSave = async (formData) => {
    await handleCreate(formData);
    onCloseCreate();
  };

  const foodsJSX =
    foods.length === 0 ? (
      <div className={classes.empty}>
        <Typography>Click the</Typography>
        <AddIcon />
        <Typography>button to add a food to your diary!</Typography>
      </div>
    ) : (
      foods.map((food) => (
        <FoodCard
          key={food.id}
          foods={foods}
          setFoods={setFoods}
          updated={updated}
          food={food}
          handleUpdate={handleUpdate}
          openOptions={optionsOpen}
          handleDelete={handleDelete}
        />
      ))
    );

  return (
    <>
      <FoodCreate
        open={createOpen}
        onSave={onSave}
        handleClose={onCloseCreate}
      />
      <div className={classes.grid}>
        {loaded ? foodsJSX : <>Loading...</>}
      </div>
    </>
  );
}
