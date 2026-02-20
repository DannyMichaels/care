import { useState, useContext, useEffect } from 'react';
import useFormData from '../../../hooks/useFormData';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import 'moment-timezone';
import CreateIcon from '@material-ui/icons/Create';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import { useFormStyles } from '../../Form/formStyles';
import { DateContext } from '../../../context/DateContext';

export default function AffirmationCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    content: '',
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  const displayDate = new Date(selectedDate + 'T00:00:00');

  return (
    <Dialog onClose={handleClose} open={open}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSave({ ...formData, affirmation_date: selectedDate });
            setFormData({ content: '' });
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogTitle onClose={handleClose}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CreateIcon style={{ marginRight: '10px' }} />
            Write something nice!
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <Moment format="dddd, MMMM Do yyyy">{displayDate}</Moment>
          </Typography>

          <TextField
            className={classes.field}
            fullWidth
            required
            autoFocus
            multiline
            rowsMax={10}
            type="text"
            name="content"
            label="Enter affirmation"
            value={formData.content}
            onChange={handleChange}
            id="outlined-multiline-static"
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={loading} variant="contained" color="primary">
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
