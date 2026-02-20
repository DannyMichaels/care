import { useEffect, useState } from "react";
import useFormData from "../../../hooks/useFormData";
import { useParams } from "react-router-dom";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment-timezone";
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
import { compareDateWithCurrentTime, toDateTimeLocal } from '@care/shared';

export default function MoodEdit(props) {
  const [loading, setLoading] = useState(false);
  const classes = useFormStyles();
  const { formData, setFormData, handleChange } = useFormData({
    status: "",
    time: "",
    reason: "",
  });
  const { id } = useParams();

  useEffect(() => {
    const prefillForm = () => {
      const moodItem = props.moods?.find((mood) => mood?.id === Number(id));
      setFormData({
        status: moodItem?.status,
        time: moodItem?.time,
        reason: moodItem?.reason,
      });
    };
    if (props.moods?.length) {
      prefillForm();
    }
  }, [props.moods, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await props.onSave(id, formData);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={props.handleClose} open={props.handleOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTitle onClose={props.handleClose}>
          <Typography>Edit Mood</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {formData.time && (
            <Typography>
              <Moment format="dddd, MMMM Do yyyy: hh:mm A">
                {formData.time}
              </Moment>
            </Typography>
          )}
          <div>
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
          </div>

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
          <Button
            to="/"
            component={Link}
            variant="contained"
            color="secondary"
            onClick={props.handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
