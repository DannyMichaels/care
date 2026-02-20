import React, { useState, useEffect } from 'react';
import useFormData from '../../../hooks/useFormData';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import { useFormStyles } from '../../Form/formStyles';
import { toDateTimeLocal } from '@care/shared';

export default function SymptomEdit({
  onSave,
  handleOpen,
  handleClose,
  symptoms,
}) {
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    name: '',
    time: '',
  });
  const { name } = formData;
  const { id } = useParams();

  useEffect(() => {
    const prefillFormData = () => {
      const oneSymptom = symptoms?.find((symptom) => {
        return symptom?.id === Number(id);
      });
      const { name, time } = oneSymptom;
      setFormData({ name, time });
    };
    if (symptoms?.length) {
      prefillFormData();
    }
  }, [symptoms, id]);

  return (
    <Dialog onClose={handleClose} open={handleOpen}>
      <DialogTitle onClose={handleClose}>
        <Typography className="title">Edit Symptom</Typography>
      </DialogTitle>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSave(id, formData);
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogContent dividers>
          <TextField
            className={classes.field}
            fullWidth
            required
            label="Symptom"
            autoFocus
            type="text"
            name="name"
            inputProps={{ maxLength: 32 }}
            value={name}
            onChange={handleChange}
          />

          <TextField
            className={classes.field}
            fullWidth
            required
            type="datetime-local"
            name="time"
            label={
              !name
                ? 'When did this happen?'
                : `When did ${name} happen?`
            }
            value={toDateTimeLocal(formData.time)}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <DialogActions>
            <Button type="submit" disabled={loading} variant="contained" color="primary">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              to="/"
              component={Link}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
}
