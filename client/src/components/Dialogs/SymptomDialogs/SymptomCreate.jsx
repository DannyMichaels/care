import { useState, useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { DateContext } from "../../../context/DateContext";
import { selectedDateToLocal } from "../../../utils/dateUtils";
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
  const [formData, setFormData] = useState({
    name: "",
    time: new Date(selectedDateToLocal(selectedDate)).toISOString(),
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "time" && value) {
      let date = new Date(value);
      value = date.toISOString();
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
          // setting the formData to an empty string after submission to avoid the case
          // where the user makes creates another one right after sending one without refreshing.
          setFormData("");
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
              value={formData.time ? new Date(formData.time).toISOString().slice(0, 16) : ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
