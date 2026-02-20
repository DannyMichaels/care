import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import SymptomCard from './SymptomCard';
import SymptomCreate from '../Dialogs/SymptomDialogs/SymptomCreate';
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

export default function Symptoms({
  symptoms,
  updated,
  handleDelete,
  handleCreate,
  loaded,
  handleUpdate,
  setSymptoms,
  createOpen,
  onCloseCreate,
  optionsOpen,
}) {
  const classes = useStyles();

  const onSave = async (formData) => {
    await handleCreate(formData);
    onCloseCreate();
  };

  const symptomsJSX =
    symptoms.length === 0 ? (
      <div className={classes.empty}>
        <Typography>Click the</Typography>
        <AddIcon />
        <Typography>button to track your symptoms!</Typography>
      </div>
    ) : (
      symptoms.map((symptom) => (
        <SymptomCard
          key={symptom.id}
          symptoms={symptoms}
          setSymptoms={setSymptoms}
          handleUpdate={handleUpdate}
          updated={updated}
          symptom={symptom}
          openOptions={optionsOpen}
          handleDelete={handleDelete}
        />
      ))
    );

  return (
    <>
      <SymptomCreate
        open={createOpen}
        onSave={onSave}
        handleClose={onCloseCreate}
      />
      <div className={classes.grid}>
        {loaded ? symptomsJSX : <>Loading...</>}
      </div>
    </>
  );
}
