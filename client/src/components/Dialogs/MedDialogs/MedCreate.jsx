import React, { useState, useContext, useEffect } from 'react';
import useFormData from '../../../hooks/useFormData';
import TextField from '@material-ui/core/TextField';
import { DateContext } from '../../../context/DateContext';
import { selectedDateToLocal, toDateTimeLocal, MED_ICONS, MED_COLORS, DEFAULT_ICON, DEFAULT_COLOR } from '@care/shared';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CreateIcon from '@material-ui/icons/Create';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import MedIconDisplay from '../../MedComponents/MedIconDisplay';
import SchedulePicker from '../../SchedulePicker/SchedulePicker';
import { useFormStyles } from '../../Form/formStyles';

export default function MedCreate({ RXGuideMeds, open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    name: '',
    medication_class: '',
    reason: '',
    image: '',
    time: '',
    is_taken: false,
    icon: DEFAULT_ICON,
    icon_color: DEFAULT_COLOR,
    schedule_unit: null,
    schedule_interval: null,
    schedule_end_date: null,
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

  const medOptions = RXGuideMeds.map((m) => m.fields.name);

  const handleAutocompleteChange = (e, value) => {
    const match = RXGuideMeds.find((m) => m.fields.name.toLowerCase().includes(value.toLowerCase()));
    setFormData((prev) => ({
      ...prev,
      name: value || '',
      image: match?.fields.image || '',
      medication_class: match?.fields.medClass || '',
      icon: match?.fields.icon || prev.icon,
      icon_color: match?.fields.iconColor || prev.icon_color,
    }));
  };

  const handleInputChange = (e, value) => {
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const medicine = RXGuideMeds.find((med) => med.fields.name === formData.name);
      const selectedMedData = {
        ...formData,
        image: medicine?.fields.image || formData.image,
        medication_class: medicine?.fields.medClass || formData.medication_class,
      };
      await onSave(selectedMedData);
      setFormData({
        name: '',
        medication_class: '',
        reason: '',
        image: '',
        time: '',
        is_taken: false,
        icon: DEFAULT_ICON,
        icon_color: DEFAULT_COLOR,
        schedule_unit: null,
        schedule_interval: null,
        schedule_end_date: null,
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit}>
        <DialogTitle onClose={handleClose}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CreateIcon style={{ margin: '10px' }} />
            Log medication
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Autocomplete
            freeSolo
            options={medOptions}
            value={formData.name}
            onChange={handleAutocompleteChange}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Medication name"
                required
                className={classes.field}
                fullWidth
              />
            )}
          />

          <TextField
            className={classes.field}
            fullWidth
            name="reason"
            type="text"
            required
            label={
              !formData.name
                ? 'Why do you take your medication?'
                : `Why do you take ${formData.name}?`
            }
            value={formData.reason}
            onChange={handleChange}
          />

          <TextField
            className={classes.field}
            fullWidth
            name="time"
            required
            id="datetime-local"
            label={
              formData.name
                ? `When do you take ${formData.name}?`
                : 'When do you take this medication?'
            }
            type="datetime-local"
            value={toDateTimeLocal(formData.time)}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <div style={{ margin: '10px' }}>
            <small style={{ color: 'inherit', opacity: 0.7 }}>Icon</small>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {MED_ICONS.map((iconName) => (
                <div
                  key={iconName}
                  onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                  style={{
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    border: formData.icon === iconName ? `2px solid ${formData.icon_color}` : '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MedIconDisplay icon={iconName} color={formData.icon_color} size={32} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ margin: '10px' }}>
            <small style={{ color: 'inherit', opacity: 0.7 }}>Color</small>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
              {MED_COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setFormData((prev) => ({ ...prev, icon_color: c }))}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    cursor: 'pointer',
                    border: formData.icon_color === c ? '3px solid currentColor' : '3px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>

          <SchedulePicker
            unit={formData.schedule_unit}
            interval={formData.schedule_interval}
            endDate={formData.schedule_end_date}
            onChange={({ unit, interval, endDate }) =>
              setFormData((prev) => ({
                ...prev,
                schedule_unit: unit,
                schedule_interval: interval,
                schedule_end_date: endDate,
              }))
            }
          />

          <DialogActions>
            <Button type="submit" disabled={loading} variant="contained" color="primary">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
}
