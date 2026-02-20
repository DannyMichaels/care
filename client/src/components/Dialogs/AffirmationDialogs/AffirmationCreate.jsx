import { useState, useContext, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import "moment-timezone";
import CreateIcon from "@material-ui/icons/Create";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";
import { DateContext } from "../../../context/DateContext";

export default function AffirmationCreate({ open, onSave, handleClose }) {
  const { selectedDate } = useContext(DateContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Display the selected date (with current time for the Moment display)
  const displayDate = new Date(selectedDate + "T00:00:00");

  return (
    <Dialog onClose={handleClose} open={open}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSave({ ...formData, affirmation_date: selectedDate });
            setFormData({ content: "" });
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogTitle onClose={handleClose}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CreateIcon style={{ marginRight: "10px" }} />
            Write something nice!
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <Moment format="dddd, MMMM Do yyyy">{displayDate}</Moment>
          </Typography>

          <div className="input-container">
            <TextField
              required
              autoFocus
              multiline
              rowsMax={10}
              type="text"
              name="content"
              label="Enter affirmation"
              style={{ width: "330px" }}
              value={formData.content}
              onChange={handleChange}
              id="outlined-multiline-static"
              rows={4}
              variant="filled"
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
