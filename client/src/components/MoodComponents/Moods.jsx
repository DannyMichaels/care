import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import MoodCard from './MoodCard';
import MoodCreate from '../Dialogs/MoodDialogs/MoodCreate';
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

export default function Moods({
  moods,
  updated,
  handleDelete,
  handleCreate,
  loaded,
  handleUpdate,
  setMoods,
  createOpen,
  onCloseCreate,
  optionsOpen,
}) {
  const classes = useStyles();

  const onSave = async (formData) => {
    await handleCreate(formData);
    onCloseCreate();
  };

  const moodsJSX =
    moods.length === 0 ? (
      <div className={classes.empty}>
        <Typography>Click the</Typography>
        <AddIcon />
        <Typography>button to log your mood!</Typography>
      </div>
    ) : (
      moods.map((mood) => (
        <MoodCard
          key={mood.id}
          setMoods={setMoods}
          handleUpdate={handleUpdate}
          updated={updated}
          mood={mood}
          moods={moods}
          openOptions={optionsOpen}
          handleDelete={handleDelete}
        />
      ))
    );

  return (
    <>
      <MoodCreate
        open={createOpen}
        onSave={onSave}
        handleClose={onCloseCreate}
      />
      <div className={classes.grid}>
        {loaded ? moodsJSX : <>Loading...</>}
      </div>
    </>
  );
}
