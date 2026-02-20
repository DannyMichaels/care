import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import 'moment-timezone';
import { compareDateWithCurrentTime } from '@care/shared';
import {
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import MedImage from '../../MedComponents/MedImage';

export default function MedDetail({
  med,
  openDetail,
  handleDetailClose,
  onDelete,
  onTake,
  onSkip,
  onUnskip,
  medIsTaken,
  medIsSkipped,
  occurrence,
  effectiveTime,
}) {
  const [medData, setMedData] = useState({});
  const skipped = !!medIsSkipped;
  const taken = !skipped && (medIsTaken !== undefined ? medIsTaken : !!med.is_taken);
  const time = effectiveTime || med.time;
  const timeStatus = compareDateWithCurrentTime(time);

  useEffect(() => {
    if (med.id) {
      setMedData({
        name: med.name,
        medication_class: med.medication_class,
        time: med.time,
        reason: med.reason,
        is_taken: true,
        taken_date: new Date().toISOString(),
      });
    }
  }, [med]);

  const getStatusContent = () => {
    if (skipped) {
      return (
        <Typography style={{ color: '#9E9E9E' }}>
          {med.name} is skipped for today
        </Typography>
      );
    }
    if (taken) {
      return (
        <Typography>
          You took {med.name} at&nbsp;
          <Moment format="MMM/DD/yyyy hh:mm A">{occurrence?.taken_date || med.taken_date}</Moment>
        </Typography>
      );
    }
    if (timeStatus < 0) {
      return (
        <Typography>
          You have to take {med.name}&nbsp;
          <Moment from={new Date().toISOString()}>{time}</Moment>
        </Typography>
      );
    }
    return <Typography>Did you take {med.name}?</Typography>;
  };

  const getActions = () => {
    if (skipped) {
      return (
        <>
          <Button variant="contained" color="primary" onClick={handleDetailClose}>
            Exit
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#9E9E9E', color: '#fff' }}
            onClick={onUnskip}
          >
            Unskip
          </Button>
        </>
      );
    }
    if (timeStatus === 1 && !taken) {
      return (
        <>
          <Button variant="contained" color="primary" onClick={handleDetailClose}>
            Not yet
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: '#9E9E9E', color: '#fff' }}
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="delete-button"
            onClick={() => onTake(med.id, medData)}
          >
            Yes
          </Button>
        </>
      );
    }
    return (
      <>
        <Button variant="contained" color="primary" onClick={handleDetailClose}>
          Exit
        </Button>
        {!taken && (
          <Button
            variant="contained"
            style={{ backgroundColor: '#9E9E9E', color: '#fff' }}
            onClick={onSkip}
          >
            Skip
          </Button>
        )}
        <Button
          variant="contained"
          color="secondary"
          className="delete-button"
          onClick={() => onDelete(med.id)}
        >
          Delete
        </Button>
      </>
    );
  };

  return (
    <Dialog onClose={handleDetailClose} open={openDetail}>
      <MuiDialogTitle disableTypography style={{ position: 'relative', padding: '16px', paddingRight: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MedImage
            icon={med.icon}
            iconColor={med.icon_color}
            alt={med.name}
            style={{ height: '30px', width: '30px' }}
          />
          <div>
            <Typography style={{ fontSize: '1.3rem', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              {med.name}
            </Typography>
            {med.medication_class && (
              <Typography variant="body2" color="textSecondary">
                {med.medication_class}
              </Typography>
            )}
          </div>
        </div>
        <IconButton
          aria-label="close"
          onClick={handleDetailClose}
          style={{ position: 'absolute', right: 8, top: 8, color: '#9e9e9e' }}
        >
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <DialogContent
        dividers
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          overflowWrap: 'break-word',
        }}
      >
        {timeStatus < 0 ? (
          <Typography>I take {med.name} because...</Typography>
        ) : (
          <Typography>I am supposed to take {med.name} because...</Typography>
        )}
        <Typography style={{ marginTop: '2px' }}>
          <small>{med.reason}</small>
        </Typography>
      </DialogContent>
      <div style={{ padding: '8px 16px' }}>
        {getStatusContent()}
      </div>
      <DialogActions>
        {getActions()}
      </DialogActions>
    </Dialog>
  );
}
