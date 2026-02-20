import { useState, useContext, useEffect } from "react";
import useFormData from "../../../hooks/useFormData";
import { DateContext } from "../../../context/DateContext";
import { selectedDateToLocal, toDateTimeLocal } from '@care/shared';
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import "moment-timezone";
import TextField from "@material-ui/core/TextField";
import {
  PoorRadio,
  OkayRadio,
  GoodRadio,
  GreatRadio,
} from "../../Form/RadioButtons";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";
import { useFormStyles } from "../../Form/formStyles";
import { compareDateWithCurrentTime } from '@care/shared';

export default function MoodCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    status: "Okay",
    time: "",
    reason: "",
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
            setFormData({ ...formData, status: formData.status });
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogTitle onClose={handleClose}>
          {compareDateWithCurrentTime(formData.time) === 1 && formData.time ? (
            <>How were you feeling? </>
          ) : (
            <>How are you feeling?</>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {formData.time && (
            <Typography>
              <Moment format="dddd, MMMM Do yyyy: hh:mm A">
                {formData.time}
              </Moment>
            </Typography>
          )}
          <FormLabel>
            Poor
            <PoorRadio
              type="radio"
              name="status"
              value="Poor"
              checked={formData.status === "Poor"}
              onChange={handleChange}
            />
          </FormLabel>
          <FormLabel>
            Okay
            <OkayRadio
              type="radio"
              name="status"
              value="Okay"
              checked={formData.status === "Okay"}
              onChange={handleChange}
            />
          </FormLabel>
          <FormLabel>
            Good
            <GoodRadio
              type="radio"
              name="status"
              value="Good"
              checked={formData.status === "Good"}
              onChange={handleChange}
            />
          </FormLabel>
          <FormLabel>
            Great
            <GreatRadio
              type="radio"
              name="status"
              value="Great"
              checked={formData.status === "Great"}
              onChange={handleChange}
            />
          </FormLabel>

          <TextField
            className={classes.field}
            fullWidth
            name="time"
            required
            id="datetime-local"
            label="Please choose a time"
            type="datetime-local"
            value={toDateTimeLocal(formData.time)}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            className={classes.field}
            fullWidth
            name="reason"
            type="text"
            required
            label={
              compareDateWithCurrentTime(formData.time) === 1 && formData.time
                ? 'why did you feel this way?'
                : 'why do you feel this way?'
            }
            value={formData.reason}
            onChange={handleChange}
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
