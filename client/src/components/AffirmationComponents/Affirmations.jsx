import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import AffirmationLetter from './AffirmationLetter';
import AffirmationCreate from '../Dialogs/AffirmationDialogs/AffirmationCreate';
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

export default function Affirmations({
  affirmations,
  updated,
  handleDelete,
  handleCreate,
  loaded,
  setAffirmations,
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

  const affirmationsJSX =
    affirmations?.length === 0 ? (
      <div className={classes.empty}>
        <Typography>Click the</Typography>
        <AddIcon />
        <Typography>button to write yourself an affirmation!</Typography>
      </div>
    ) : (
      affirmations.map((affirmation) => (
        <AffirmationLetter
          key={affirmation.id}
          updated={updated}
          setAffirmations={setAffirmations}
          handleUpdate={handleUpdate}
          affirmation={affirmation}
          openOptions={optionsOpen}
          handleDelete={handleDelete}
          affirmations={affirmations}
        />
      ))
    );

  return (
    <>
      <AffirmationCreate
        open={createOpen}
        onSave={onSave}
        handleClose={onCloseCreate}
      />
      <div className={classes.grid}>
        {loaded ? affirmationsJSX : <>Loading...</>}
      </div>
    </>
  );
}
