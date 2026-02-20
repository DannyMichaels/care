import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link, Route, Switch } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import SymptomEdit from '../Dialogs/SymptomDialogs/SymptomEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import GlassCard from '../shared/GlassCard';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    paddingTop: theme.spacing(1),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
}));

export default function SymptomCard({
  handleUpdate,
  symptom,
  openOptions,
  handleDelete,
  symptoms,
  setSymptoms,
}) {
  const classes = useStyles();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const onSave = async (id, formData) => {
    setIsRefreshed(true);
    try {
      await handleUpdate(id, formData);
    } finally {
      setIsRefreshed(false);
      setOpenEdit(false);
    }
  };

  const handleOpen = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  return (
    <>
      {!isRefreshed ? (
        <GlassCard>
          <div className={classes.container}>
            <Typography variant="subtitle1">{symptom.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              <Moment format="MMM/DD/yyyy hh:mm A">
                {symptom.time?.toLocaleString()}
              </Moment>
            </Typography>
            {openOptions && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div className={classes.actions}>
                  <IconButton
                    component={Link}
                    onClick={handleOpen}
                    to={`/symptoms/${symptom.id}/edit`}
                    color="primary"
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(symptom.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      ) : (
        <div className={classes.loading}>
          <CircularProgress style={{ height: '60px', width: '60px' }} />
        </div>
      )}

      {openEdit && (
        <Switch>
          <Route path="/symptoms/:id/edit">
            <SymptomEdit
              handleOpen={handleOpen}
              symptoms={symptoms}
              onSave={onSave}
              handleClose={handleClose}
            />
          </Route>
        </Switch>
      )}
    </>
  );
}
