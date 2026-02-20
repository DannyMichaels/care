import { useState, useContext, useEffect } from 'react';
import useFormData from '../../../hooks/useFormData';
import TextField from '@material-ui/core/TextField';
import { DateContext } from '../../../context/DateContext';
import { selectedDateToLocal, toDateTimeLocal } from '@care/shared';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CreateIcon from '@material-ui/icons/Create';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import { useFormStyles } from '../../Form/formStyles';

export default function SymptomCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    name: '',
    time: '',
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      setFormData((prev) => ({
        ...prev,
        time: new Date(selectedDateToLocal(selectedDate)).toISOString(),
      }));
    }
  }, [open, selectedDate]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSave(formData);
            setFormData('');
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogTitle onClose={handleClose}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CreateIcon style={{ marginRight: '10px' }} />
            Log symptom
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            className={classes.field}
            fullWidth
            required
            autoFocus
            type="text"
            name="name"
            inputProps={{ maxLength: 32 }}
            label="Enter symptom"
            value={formData.name}
            onChange={handleChange}
            id="outlined-multiline-static"
          />

          <TextField
            className={classes.field}
            fullWidth
            name="time"
            required
            id="datetime-local"
            label={
              !formData.name
                ? 'When did this happen?'
                : `When did ${formData.name} happen?`
            }
            type="datetime-local"
            value={toDateTimeLocal(formData.time)}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
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
