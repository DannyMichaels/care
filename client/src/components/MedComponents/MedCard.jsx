import React, { useEffect, useState, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import { Switch, Route, Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/core/styles';
import MedEdit from '../Dialogs/MedDialogs/MedEdit';
import CircularProgress from '@material-ui/core/CircularProgress';
import MedDetail from '../Dialogs/MedDialogs/MedDetail';
import Typography from '@material-ui/core/Typography';
import { compareDateWithCurrentTime, isScheduledMed, getEffectiveTime, createOccurrence, deleteOccurrence } from '@care/shared';
import MedImage from './MedImage';
import GlassCard from '../shared/GlassCard';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  clickArea: {
    cursor: 'pointer',
  },
  medName: {
    fontFamily: 'Montserrat',
    fontSize: '1.1rem',
  },
  imageWrap: {
    padding: theme.spacing(2, 0),
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

export default function MedCard({
  meds,
  handleUpdate,
  med,
  openOptions,
  handleDelete,
  RXGuideMeds,
  selectedDate,
  onOccurrenceChange,
}) {
  const classes = useStyles();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rerender, toggleRerender] = useState(false);

  const timerId = useRef(null);

  const scheduled = isScheduledMed(med);
  const occurrence = med.occurrence;

  // Normalize scheduled/one-time state into one place
  const source = scheduled ? (occurrence || {}) : med;
  const skipped = !!source.skipped;
  const taken = !skipped && !!source.is_taken;
  const takenDate = source.taken_date;

  const effectiveTime = getEffectiveTime(med, selectedDate);

  const timeStatus = compareDateWithCurrentTime(effectiveTime);

  const getStatusText = () => {
    if (skipped) {
      return (
        <Typography variant="body2" style={{ color: '#9E9E9E' }}>
          {med.name} is skipped for today
        </Typography>
      );
    }
    if (taken) {
      return (
        <Typography variant="body2">
          You took {med.name} at <br />
          <Moment format="MMM/DD/yyyy hh:mm A">{takenDate}</Moment>
        </Typography>
      );
    }
    if (timeStatus < 0) {
      return (
        <Typography variant="body2">
          You have to take {med.name} at <br />
          <Moment format="MMM/DD/yyyy hh:mm A">{effectiveTime}</Moment>
        </Typography>
      );
    }
    return (
      <Typography variant="body2">
        You were supposed to take {med.name} at <br />
        <Moment format="MMM/DD/yyyy hh:mm A">{effectiveTime}</Moment>
      </Typography>
    );
  };

  const onSave = async (id, formData, options) => {
    setIsRefreshed(true);
    try {
      await handleUpdate(id, formData, options);
    } finally {
      setIsRefreshed(false);
      setOpenEdit(false);
    }
  };

  const onDelete = (id) => {
    handleDelete(id);
    setOpenDetail(false);
  };

  const onTake = (id, medData) => {
    handleUpdate(id, medData);
    setOpenDetail(false);
  };

  const onUnskip = async () => {
    if (scheduled && occurrence?.id) {
      await deleteOccurrence(med.id, occurrence.id);
      onOccurrenceChange?.();
    } else {
      await handleUpdate(med.id, { skipped: false });
    }
    setOpenDetail(false);
  };

  const onSkip = async () => {
    if (scheduled) {
      await createOccurrence(med.id, { occurrence_date: selectedDate, skipped: true });
      onOccurrenceChange?.();
    } else {
      await handleUpdate(med.id, { skipped: true });
    }
    setOpenDetail(false);
  };

  useEffect(() => {
    if (timeStatus === -1) {
      let delay = new Date(effectiveTime).getTime() - Date.now();
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        toggleRerender(!rerender);
      }, delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveTime]);

  return (
    <>
      <GlassCard style={{ cursor: 'pointer' }}>
        <div className={classes.container}>
          <Typography
            className={classes.medName}
            onClick={() => setOpenDetail(true)}
          >
            {med.name}
          </Typography>
          {!isRefreshed ? (
            <div className={classes.imageWrap}>
              <MedImage
                onClick={() => setOpenDetail(true)}
                icon={med.icon}
                iconColor={med.icon_color}
                alt={med.name}
                style={{ width: '50px', height: '50px' }}
              />
            </div>
          ) : (
            <div className={classes.loading}>
              <CircularProgress style={{ height: '80px', width: '80px' }} />
            </div>
          )}
          <div onClick={() => setOpenDetail(true)} className={classes.clickArea}>
            {getStatusText()}
          </div>

          {openOptions && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div className={classes.actions}>
                <IconButton
                  component={Link}
                  onClick={() => setOpenEdit(true)}
                  to={`/medications/${med.id}/edit`}
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={() => handleDelete(med.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </>
          )}
        </div>
        {openDetail && (
          <MedDetail
            med={med}
            openDetail={openDetail}
            onDelete={onDelete}
            onTake={onTake}
            onSkip={onSkip}
            onUnskip={onUnskip}
            handleDetailClose={() => setOpenDetail(false)}
            medIsTaken={taken}
            medIsSkipped={skipped}
            occurrence={occurrence}
            effectiveTime={effectiveTime}
          />
        )}
      </GlassCard>

      {openEdit && (
        <Switch>
          <Route path="/medications/:id/edit">
            <MedEdit
              taken={med.is_taken}
              meds={meds}
              onSave={onSave}
              RXGuideMeds={RXGuideMeds}
              handleOpen={() => setOpenEdit(true)}
              handleUpdate={handleUpdate}
              setOpenEdit={setOpenEdit}
              handleClose={() => setOpenEdit(false)}
            />
          </Route>
        </Switch>
      )}
    </>
  );
}
