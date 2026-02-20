import React, { useState, useEffect } from "react";
import useFormData from "../../../hooks/useFormData";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";

export default function AffirmationEdit({
  handleOpen,
  handleClose,
  onSave,
  affirmations,
}) {
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useFormData({
    content: "",
  });
  const { content } = formData;
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    const prefillFormData = () => {
      const oneAffirmation = affirmations?.find((affirmation) => {
        return affirmation?.id === Number(id);
      });
      if (oneAffirmation?.content === undefined) {
        history.push("/");
      } else {
        const { content } = oneAffirmation;
        setFormData({ content });
      }
    };
    if (affirmations?.length) {
      prefillFormData();
    }
  }, [affirmations, id, history]);

  return (
    <Dialog onClose={handleClose} open={handleOpen}>
      <DialogTitle>
        <Typography className="title">Edit Affirmation</Typography>
      </DialogTitle>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            await onSave(id, formData);
          } catch {
            setLoading(false);
          }
        }}
      >
        <DialogContent dividers>
          <div className="input-container">
            <TextField
              required
              label="content"
              variant="filled"
              className="string-input title"
              autoFocus
              multiline
              rows={4}
              type="text"
              name="content"
              value={content}
              onChange={handleChange}
            />
          </div>

          <DialogActions>
            <Button type="submit" disabled={loading} variant="contained" color="primary">
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
  );
}
