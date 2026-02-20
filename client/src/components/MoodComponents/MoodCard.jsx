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
import { emojiLogic } from '../../utils/emojiLogic';
import MoodEdit from '../Dialogs/MoodDialogs/MoodEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoodDetail from '../Dialogs/MoodDialogs/MoodDetail';
import GlassCard from '../shared/GlassCard';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  clickArea: {
    cursor: 'pointer',
  },
  status: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 4,
    paddingTop: theme.spacing(1),
  },
}));

export default function MoodCard({
  mood,
  updated,
  openOptions,
  handleDelete,
  handleUpdate,
  moods,
  setMoods,
}) {
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const handleOpen = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const onSave = async (id, formData) => {
    setIsRefreshed(true);
    try {
      await handleUpdate(id, formData);
    } finally {
      setIsRefreshed(false);
      setOpenEdit(false);
    }
  };

  const onDelete = (id) => {
    handleDelete(id);
    if (openDetail) {
      setOpenDetail(false);
    }
  };

  return (
    <>
      <GlassCard>
        <div className={classes.container}>
          <div className={classes.clickArea} onClick={() => setOpenDetail(true)}>
            <div className={classes.status}>
              {!isRefreshed ? emojiLogic(mood.status) : <CircularProgress />}
              <Typography variant="subtitle1">{mood.status}</Typography>
            </div>
            <Typography variant="caption" color="textSecondary">
              <Moment format="MMM/DD/yyyy hh:mm A">{mood.time}</Moment>
            </Typography>
          </div>
          {openOptions && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div className={classes.actions}>
                <IconButton
                  component={Link}
                  to={`/moods/${mood.id}/edit`}
                  onClick={handleOpen}
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(mood.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </>
          )}
        </div>
      </GlassCard>
      <>
        {openEdit && (
          <Switch>
            <Route path="/moods/:id/edit">
              <MoodEdit
                handleOpen={handleOpen}
                moods={moods}
                onSave={onSave}
                handleUpdate={handleUpdate}
                handleClose={handleClose}
              />
            </Route>
          </Switch>
        )}
        {openDetail && (
          <MoodDetail
            mood={mood}
            openDetail={openDetail}
            onDelete={onDelete}
            setOpenDetail={setOpenDetail}
          />
        )}
      </>
    </>
  );
}
