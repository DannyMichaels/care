import { useState, useContext, useEffect } from "react";
import useFormData from "../../../hooks/useFormData";
import TextField from "@material-ui/core/TextField";
import { DateContext } from "../../../context/DateContext";
import { selectedDateToLocal, toDateTimeLocal } from '@care/shared';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import CreateIcon from "@material-ui/icons/Create";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";

export default function SymptomCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useFormData({
    name: "",
    time: "",
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
            setFormData("");
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogTitle onClose={handleClose}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CreateIcon style={{ marginRight: "10px" }} />
            Log symptom
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="input-container">
            <TextField
              required
              autoFocus
              type="text"
              name="name"
              inputProps={{ maxLength: 32 }}
              label="Enter symptom"
              style={{ width: "300px", margin: "10px" }}
              value={formData.name}
              onChange={handleChange}
              id="outlined-multiline-static"
              variant="filled"
            />
          </div>

          <div className="input-container">
            <TextField
              name="time"
              required
              id="datetime-local"
              label={
                !formData.name
                  ? `When did this happen?`
                  : `When did ${formData.name} happen?`
              }
              type="datetime-local"
              style={{ width: "300px", margin: "10px" }}
              value={toDateTimeLocal(formData.time)}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
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
