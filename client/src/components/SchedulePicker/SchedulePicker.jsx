import React, { useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { SCHEDULE_PRESETS, getScheduleDescription } from '@care/shared';

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  label: {
    marginBottom: theme.spacing(0.5),
    opacity: 0.7,
    fontSize: '0.75rem',
  },
  modeGroup: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  modeButton: {
    flex: 1,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  toggleText: {
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: 4,
  },
  toggleActive: {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  presetRow: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginBottom: theme.spacing(1),
  },
  advancedRow: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  intervalInput: {
    width: 80,
  },
  unitSelect: {
    minWidth: 100,
  },
  description: {
    fontStyle: 'italic',
    marginBottom: theme.spacing(0.5),
  },
  endDateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

export default function SchedulePicker({ unit, interval, endDate, onChange }) {
  const classes = useStyles();
  const isScheduled = !!unit;
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleModeChange = (scheduled) => {
    if (!scheduled) {
      onChange({ unit: null, interval: null, endDate: null });
      setAdvancedMode(false);
    } else {
      onChange({ unit: 'day', interval: 1, endDate });
    }
  };

  const handlePresetSelect = (preset) => {
    onChange({ unit: preset.unit, interval: preset.interval, endDate });
    setAdvancedMode(false);
  };

  const isPresetActive = (preset) => {
    return unit === preset.unit && interval === preset.interval;
  };

  const description = getScheduleDescription(unit, interval);

  return (
    <div className={classes.container}>
      <small className={classes.label}>Schedule</small>

      <ButtonGroup className={classes.modeGroup} size="small">
        <Button
          className={classes.modeButton}
          variant={!isScheduled ? 'contained' : 'outlined'}
          color={!isScheduled ? 'primary' : 'default'}
          onClick={() => handleModeChange(false)}
        >
          One-time
        </Button>
        <Button
          className={classes.modeButton}
          variant={isScheduled ? 'contained' : 'outlined'}
          color={isScheduled ? 'primary' : 'default'}
          onClick={() => handleModeChange(true)}
        >
          Recurring
        </Button>
      </ButtonGroup>

      {isScheduled && (
        <>
          <div className={classes.toggleRow}>
            <span
              className={`${classes.toggleText} ${!advancedMode ? classes.toggleActive : ''}`}
              onClick={() => setAdvancedMode(false)}
            >
              Simple
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span
              className={`${classes.toggleText} ${advancedMode ? classes.toggleActive : ''}`}
              onClick={() => setAdvancedMode(true)}
            >
              Advanced
            </span>
          </div>

          {!advancedMode ? (
            <div className={classes.presetRow}>
              {SCHEDULE_PRESETS.map((preset) => (
                <Chip
                  key={preset.label}
                  label={preset.label}
                  color={isPresetActive(preset) ? 'primary' : 'default'}
                  variant={isPresetActive(preset) ? 'default' : 'outlined'}
                  onClick={() => handlePresetSelect(preset)}
                  clickable
                />
              ))}
            </div>
          ) : (
            <div className={classes.advancedRow}>
              <TextField
                label="Every"
                type="number"
                size="small"
                variant="outlined"
                className={classes.intervalInput}
                value={interval || ''}
                onChange={(e) => {
                  const num = parseInt(e.target.value, 10);
                  if (!e.target.value) {
                    onChange({ unit, interval: null, endDate });
                  } else if (num >= 1 && num <= 99) {
                    onChange({ unit, interval: num, endDate });
                  }
                }}
                inputProps={{ min: 1, max: 99 }}
              />
              <Select
                variant="outlined"
                size="small"
                className={classes.unitSelect}
                value={unit || 'day'}
                onChange={(e) => onChange({ unit: e.target.value, interval: interval || 1, endDate })}
              >
                <MenuItem value="day">Days</MenuItem>
                <MenuItem value="week">Weeks</MenuItem>
                <MenuItem value="month">Months</MenuItem>
              </Select>
            </div>
          )}

          {description && (
            <Typography variant="caption" className={classes.description}>
              {description}
            </Typography>
          )}

          <div className={classes.endDateRow}>
            {endDate ? (
              <>
                <Typography variant="body2">Ends: {endDate}</Typography>
                <IconButton size="small" onClick={() => onChange({ unit, interval, endDate: null })}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <TextField
                label="End date (optional)"
                type="date"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    onChange({ unit, interval, endDate: e.target.value });
                  }
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
