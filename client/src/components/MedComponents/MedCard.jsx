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
import { compareDateWithCurrentTime, isScheduledMed } from '@care/shared';
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
  setMeds,
  handleUpdate,
  med,
  openOptions,
  handleDelete,
  RXGuideMeds,
  occurrences = [],
  selectedDate,
}) {
  const classes = useStyles();
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [rerender, toggleRerender] = useState(false);

  let timerId = useRef(null);

  const scheduled = isScheduledMed(med);
  const occurrence = occurrences.find(
    (o) => o.medication_id === med.id && o.occurrence_date === selectedDate
  );
  const medIsTaken = scheduled ? !!occurrence?.is_taken : !!med.is_taken;

  const effectiveTime = (() => {
    if (!scheduled || !selectedDate) return med.time;
    const t = new Date(med.time);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    return `${selectedDate}T${hh}:${mm}:00`;
  })();

  const onSave = (id, formData) => {
    handleUpdate(id, formData);
    setIsRefreshed(true);
    setTimeout(async () => {
      setIsRefreshed(false);
      setOpenEdit(false);
    }, 800);
    setMeds(meds);
  };

  const handleOpen = () => {
    setOpenEdit(true);
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
  };

  const handleDetailOpen = () => {
    setOpenDetail(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const onDelete = (id) => {
    handleDelete(id);
    setOpenDetail(false);
  };

  const onTake = (id, medData) => {
    handleUpdate(id, medData);
    setOpenDetail(false);
  };

  useEffect(() => {
    if (compareDateWithCurrentTime(effectiveTime) === -1) {
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
            onClick={handleDetailOpen}
          >
            {med.name}
          </Typography>
          {!isRefreshed ? (
            <div className={classes.imageWrap}>
              <MedImage
                onClick={handleDetailOpen}
                icon={med.icon}
                iconColor={med.icon_color}
                alt={med.name}
                style={{
                  width: '50px',
                  height: '50px',
                }}
              />
            </div>
          ) : (
            <div className={classes.loading}>
              <CircularProgress style={{ height: '80px', width: '80px' }} />
            </div>
          )}
          {!medIsTaken && compareDateWithCurrentTime(effectiveTime) < 0 ? (
            <div onClick={handleDetailOpen} className={classes.clickArea}>
              <Typography variant="body2">
                You have to take {med?.name} at <br />
                <Moment format="MMM/DD/yyyy hh:mm A">{effectiveTime}</Moment>
              </Typography>
            </div>
          ) : !medIsTaken && compareDateWithCurrentTime(effectiveTime) === 1 ? (
            <div onClick={handleDetailOpen} className={classes.clickArea}>
              <Typography variant="body2">
                You were supposed to take {med?.name} at <br />
                <Moment format="MMM/DD/yyyy hh:mm A">{effectiveTime}</Moment>
              </Typography>
            </div>
          ) : (
            <div onClick={handleDetailOpen} className={classes.clickArea}>
              <Typography variant="body2">
                You took {med?.name} at <br />
                <Moment format="MMM/DD/yyyy hh:mm A">{scheduled ? occurrence?.taken_date : med?.taken_date}</Moment>
              </Typography>
            </div>
          )}

          {openOptions && (
            <>
              <Divider style={{ margin: '8px 0' }} />
              <div className={classes.actions}>
                <IconButton
                  component={Link}
                  onClick={handleOpen}
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
            handleDetailClose={handleDetailClose}
            medIsTaken={medIsTaken}
            occurrence={occurrence}
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
              handleOpen={handleOpen}
              handleUpdate={handleUpdate}
              setOpenEdit={setOpenEdit}
              handleClose={handleClose}
            />
          </Route>
        </Switch>
      )}
    </>
  );
}
