import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { compareTakenWithSelectedTime, MED_ICONS, MED_COLORS, DEFAULT_ICON, DEFAULT_COLOR } from '@care/shared';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import MedIconDisplay from '../../MedComponents/MedIconDisplay';

export default function MedEdit({
  RXGuideMeds,
  onSave,
  handleOpen,
  handleClose,
  meds,
  taken,
}) {
  const [formData, setFormData] = useState({
    name: '',
    medication_class: '',
    reason: '',
    image: '',
    time: new Date(),
    is_taken: false,
    icon: DEFAULT_ICON,
    icon_color: DEFAULT_COLOR,
  });

  const { name } = formData;
  const { id } = useParams();

  useEffect(() => {
    const prefillFormData = () => {
      const oneMed = meds?.find((med) => med?.id === Number(id));
      const { name, medication_class, image, reason, time, is_taken, icon, icon_color } = oneMed;
      setFormData({
        name,
        medication_class,
        image,
        time,
        reason,
        is_taken,
        icon: icon || DEFAULT_ICON,
        icon_color: icon_color || DEFAULT_COLOR,
      });
    };
    if (meds?.length) {
      prefillFormData();
    }
  }, [meds, id]);

  const medOptions = RXGuideMeds.map((m) => m.fields.name);

  const handleAutocompleteChange = (e, value) => {
    const match = RXGuideMeds.find((m) => m.fields.name === value);
    setFormData((prev) => ({
      ...prev,
      name: value || '',
      image: match?.fields.image || prev.image,
      medication_class: match?.fields.medClass || prev.medication_class,
      icon: match?.fields.icon || prev.icon,
      icon_color: match?.fields.iconColor || prev.icon_color,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const medicine = RXGuideMeds.find((med) => med.fields.name === formData.name);
    const selectedMedData = {
      ...formData,
      image: medicine?.fields.image || formData.image,
      medication_class: medicine?.fields.medClass || formData.medication_class,
    };
    onSave(id, selectedMedData);
  };

  return (
    <Dialog onClose={handleClose} open={handleOpen}>
      <DialogTitle onClose={handleClose}>
        <Typography className="title">Edit Medication</Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="input-container">
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
                  style={{ width: '300px', marginLeft: '10px' }}
                />
              )}
            />
          </div>

          <div className="input-container">
            <TextField
              className="select-css"
              name="reason"
              type="text"
              required
              label={
                name && taken === false
                  ? `Why do you take ${formData.name}?`
                  : !name
                  ? 'Why do you take your medication?'
                  : name && taken === true
                  ? `Why did you take ${formData.name}?`
                  : 'Why do you take this medication?'
              }
              style={{ display: 'flex', width: '300px', margin: '10px' }}
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <div className="input-container">
            <TextField
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
              style={{ width: '300px', margin: '10px' }}
              value={formData.time ? new Date(formData.time).toISOString().slice(0, 16) : ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </div>

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

          <DialogActions>
            <Button to="/" type="submit" variant="contained" color="primary">
              Save
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
