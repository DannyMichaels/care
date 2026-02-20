import { useState, useContext, useEffect } from 'react';
import useFormData from '../../../hooks/useFormData';
import TextField from '@material-ui/core/TextField';
import { DateContext } from '../../../context/DateContext';
import { selectedDateToLocal, toDateTimeLocal } from '@care/shared';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CreateIcon from '@material-ui/icons/Create';
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import { useFormStyles } from '../../Form/formStyles';
import { foodIcon, foodName } from '../../../utils/foodUtils';
import { Box } from '@material-ui/core';

export default function FoodCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    name: '',
    time: '',
    rating: 1,
    factors: '',
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
            Log food
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            required
            autoFocus
            inputProps={{ maxLength: 20 }}
            type="text"
            name="name"
            label="Food/meal name"
            className={classes.field}
            fullWidth
            value={formData.name}
            onChange={handleChange}
            id="outlined-multiline-static"
            InputProps={{
              startAdornment: (
                <Box role="img" aria-label={formData.name} mt={2}>
                  {foodIcon(formData.name)}
                </Box>
              ),
            }}
          />

          <TextField
            name="time"
            required
            id="datetime-local"
            label={
              !formData.name
                ? 'When did you eat this?'
                : `When did you eat ${formData.name}?`
            }
            type="datetime-local"
            className={classes.field}
            fullWidth
            value={toDateTimeLocal(formData.time)}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <div className={classes.ratingContainer}>
            <FormHelperText>
              On a scale of 1 to 5,
              <br /> how much did you enjoy&nbsp;
              {formData.name ? foodName(formData.name) : 'it'}?
            </FormHelperText>
            <NativeSelect
              required
              label="rating"
              value={formData.rating}
              onChange={handleChange}
              inputProps={{
                name: 'rating',
                id: 'rating-native-simple',
              }}
            >
              <option value={1}>⭐</option>
              <option value={2}>⭐ ⭐ </option>
              <option value={3}>⭐ ⭐ ⭐ </option>
              <option value={4}>⭐ ⭐ ⭐ ⭐ </option>
              <option value={5}>⭐ ⭐ ⭐ ⭐ ⭐ </option>
            </NativeSelect>
          </div>

          <TextField
            name="factors"
            required
            id="factor-input"
            inputProps={{ maxLength: 131 }}
            label="What were the leading factors?"
            type="text"
            className={classes.field}
            fullWidth
            value={formData.factors}
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
