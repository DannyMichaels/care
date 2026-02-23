import React, { useState, useEffect, useRef } from 'react';
import useFormData from '../../../hooks/useFormData';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { compareTakenWithSelectedTime, toDateTimeLocal, isScheduledMed, createOccurrence, updateOccurrence, MED_ICONS, MED_COLORS, DEFAULT_ICON, DEFAULT_COLOR } from '@care/shared';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import MedIconDisplay from '../../MedComponents/MedIconDisplay';
import SchedulePicker from '../../SchedulePicker/SchedulePicker';
import { useFormStyles } from '../../Form/formStyles';

export default function MedEdit({
  RXGuideMeds,
  onSave,
  handleOpen,
  handleClose,
  meds,
  taken,
  selectedDate,
  occurrence,
  onOccurrenceChange,
}) {
  const [loading, setLoading] = useState(false);
  const [showTimeScope, setShowTimeScope] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData } = useFormData({
    name: '',
    medication_class: '',
    reason: '',
    image: '',
    time: new Date(),
    is_taken: false,
    icon: DEFAULT_ICON,
    icon_color: DEFAULT_COLOR,
    schedule_unit: null,
    schedule_interval: null,
    schedule_end_date: null,
  });

  const originalTimeRef = useRef(null);
  const pendingDataRef = useRef(null);

  const { name } = formData;
  const { id } = useParams();

  useEffect(() => {
    const prefillFormData = () => {
      const oneMed = meds?.find((med) => med?.id === Number(id));
      const { name, medication_class, image, reason, time, is_taken, icon, icon_color, schedule_unit, schedule_interval, schedule_end_date } = oneMed;
      originalTimeRef.current = time;
      setFormData({
        name,
        medication_class,
        image,
        time,
        reason,
        is_taken,
        icon: icon || DEFAULT_ICON,
        icon_color: icon_color || DEFAULT_COLOR,
        schedule_unit: schedule_unit || null,
        schedule_interval: schedule_interval || null,
        schedule_end_date: schedule_end_date || null,
      });
    };
    if (meds?.length) {
      prefillFormData();
    }
  }, [meds, id]);

  const medOptions = (() => {
    const rxNames = RXGuideMeds.map((m) => m.fields.name);
    const seen = new Set(rxNames.map((n) => n.toLowerCase()));
    const userNames = (meds || [])
      .filter((m) => m.name && !seen.has(m.name.toLowerCase()))
      .map((m) => m.name);
    return [...rxNames, ...userNames];
  })();

  const handleAutocompleteChange = (e, value) => {
    const rxMatch = RXGuideMeds.find((m) => m.fields.name === value);
    const userMatch = !rxMatch && meds?.find((m) => m.name?.toLowerCase() === value?.toLowerCase());
    setFormData((prev) => ({
      ...prev,
      name: value || '',
      image: rxMatch?.fields.image || prev.image,
      medication_class: rxMatch?.fields.medClass || userMatch?.medication_class || prev.medication_class,
      icon: rxMatch?.fields.icon || userMatch?.icon || prev.icon,
      icon_color: rxMatch?.fields.iconColor || userMatch?.icon_color || prev.icon_color,
    }));
  };

  const handleInputChange = (e, value) => {
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'time' && value) {
      value = new Date(value).toISOString();
    }

    const foundMed = meds?.find((med) => med?.id === Number(id));

    if (foundMed.is_taken) {
      if (compareTakenWithSelectedTime(foundMed.taken_date, formData.time) === 1) {
        setFormData((prev) => ({
          ...prev,
          is_taken: false,
          taken_date: null,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          is_taken: true,
          taken_date: formData.time,
        }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const timeChanged = () => {
    if (!originalTimeRef.current || !formData.time) return false;
    const orig = new Date(originalTimeRef.current);
    const curr = new Date(formData.time);
    return orig.getHours() !== curr.getHours() || orig.getMinutes() !== curr.getMinutes();
  };

  const buildMedData = () => {
    const medicine = RXGuideMeds.find((med) => med.fields.name === formData.name);
    return {
      ...formData,
      image: medicine?.fields.image || formData.image,
      medication_class: medicine?.fields.medClass || formData.medication_class,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundMed = meds?.find((med) => med?.id === Number(id));
    const isScheduled = foundMed && isScheduledMed(foundMed);

    if (isScheduled && timeChanged()) {
      pendingDataRef.current = buildMedData();
      setShowTimeScope(true);
      return;
    }

    setLoading(true);
    try {
      const selectedMedData = buildMedData();
      const wasScheduled = foundMed && isScheduledMed(foundMed);
      const becomingOneTime = wasScheduled && !formData.schedule_unit;
      const options = becomingOneTime ? { conversion_date: selectedDate } : {};
      await onSave(id, selectedMedData, options);
    } catch {
      setLoading(false);
    }
  };

  const handleTimeScopeAll = async () => {
    setShowTimeScope(false);
    setLoading(true);
    try {
      const foundMed = meds?.find((med) => med?.id === Number(id));
      const wasScheduled = foundMed && isScheduledMed(foundMed);
      const becomingOneTime = wasScheduled && !formData.schedule_unit;
      const options = becomingOneTime ? { conversion_date: selectedDate } : {};
      await onSave(id, pendingDataRef.current, options);
    } catch {
      setLoading(false);
    }
  };

  const handleTimeScopeThisDay = async () => {
    setShowTimeScope(false);
    setLoading(true);
    try {
      const medData = { ...pendingDataRef.current, time: originalTimeRef.current };
      const foundMed = meds?.find((med) => med?.id === Number(id));
      const wasScheduled = foundMed && isScheduledMed(foundMed);
      const becomingOneTime = wasScheduled && !formData.schedule_unit;
      const options = becomingOneTime ? { conversion_date: selectedDate } : {};
      await onSave(id, medData, options);

      const newTime = new Date(pendingDataRef.current.time).toISOString();
      if (occurrence?.id) {
        await updateOccurrence(Number(id), occurrence.id, { time: newTime });
      } else {
        await createOccurrence(Number(id), { occurrence_date: selectedDate, time: newTime });
      }
      onOccurrenceChange?.();
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={handleOpen}>
        <DialogTitle onClose={handleClose}>
          <Typography className="title">Edit Medication</Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Autocomplete
              freeSolo
              options={medOptions}
              inputValue={formData.name}
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
              label={
                name && taken === false
                  ? `Why do you take ${formData.name}?`
                  : !name
                  ? 'Why do you take your medication?'
                  : name && taken === true
                  ? `Why did you take ${formData.name}?`
                  : 'Why do you take this medication?'
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
                name && taken === false
                  ? `When do you take ${formData.name}?`
                  : !name
                  ? 'When do you take this medication?'
                  : name && taken === true
                  ? `When did you take ${formData.name}?`
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
                      border: formData.icon_color === c ? '3px solid currentColor' : c === '#FFFFFF' ? '1px solid #ccc' : '3px solid transparent',
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
              <Button to="/" type="submit" disabled={loading} variant="contained" color="primary">
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

      <Dialog open={showTimeScope} onClose={() => setShowTimeScope(false)}>
        <DialogContent style={{ minWidth: 280, padding: '24px 24px 8px' }}>
          <Typography>
            Change the time for all occurrences or just this day?
          </Typography>
        </DialogContent>
        <DialogActions style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleTimeScopeAll}
          >
            All occurrences
          </Button>
          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: '#9E9E9E', color: '#fff' }}
            onClick={handleTimeScopeThisDay}
          >
            Just this day
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowTimeScope(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
