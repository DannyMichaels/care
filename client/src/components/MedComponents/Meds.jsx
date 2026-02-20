import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import MedCard from './MedCard';
import MedCreate from '../Dialogs/MedDialogs/MedCreate';
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

export default function Meds({
  meds,
  setMeds,
  updated,
  handleDelete,
  handleCreate,
  loaded,
  RXGuideMeds,
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

  const medsJSX =
    meds.length === 0 ? (
      <div className={classes.empty}>
        <Typography>Click the</Typography>
        <AddIcon />
        <Typography>button to add a medication!</Typography>
      </div>
    ) : (
      meds.map((med) => (
        <MedCard
          key={med.id}
          openOptions={optionsOpen}
          RXGuideMeds={RXGuideMeds}
          meds={meds}
          setMeds={setMeds}
          updated={updated}
          med={med}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      ))
    );

  return (
    <>
      <MedCreate
        RXGuideMeds={RXGuideMeds}
        open={createOpen}
        onSave={onSave}
        handleClose={onCloseCreate}
      />
      <div className={classes.grid}>
        {loaded ? medsJSX : <>Loading...</>}
      </div>
    </>
  );
}
