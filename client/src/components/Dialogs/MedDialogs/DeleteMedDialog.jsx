import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';

const useStyles = makeStyles((theme) => ({
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: theme.spacing(2),
  },
}));

export default function DeleteMedDialog({
  open,
  onClose,
  med,
  scheduled,
  onSkipDay,
  onDeleteUntaken,
  onDeleteMed,
}) {
  const classes = useStyles();

  if (!scheduled) {
    return (
      <Dialog onClose={onClose} open={open}>
        <DialogContent style={{ minWidth: 280, padding: '24px 24px 8px' }}>
          <Typography>
            Are you sure you want to delete <strong>{med.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'space-evenly', padding: 16 }}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onDeleteMed}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogContent style={{ minWidth: 280, padding: '24px 24px 8px' }}>
        <Typography>
          What would you like to do with <strong>{med.name}</strong>?
        </Typography>
      </DialogContent>
      <div className={classes.actions}>
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: '#9E9E9E', color: '#fff' }}
          onClick={onSkipDay}
        >
          Skip this day
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={onDeleteUntaken}
        >
          Delete untaken occurrences
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={onDeleteMed}
        >
          Delete medication
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
