import { useState } from "react";
import useFormData from "../../../hooks/useFormData";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import { Div, Form } from "./styledInsightCreate.js";

export default function InsightCreate({ handleCreate, moderationError }) {
  const [openAbout, setOpenAbout] = useState(false);

  const handleOpen = () => {
    setOpenAbout(!openAbout);
  };

  const { formData, handleChange } = useFormData({
    title: "",
    description: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleCreate(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      <div className="title-container">
        <Typography className="title">
          Help the community by sharing an insight!
          <HelpIcon className="about-icon" onClick={handleOpen} />
        </Typography>
        {openAbout && (
          <div className="about-container">
            <Typography>
              an insight is information or a personal experience that is
              educational, actionable, and/or reassuring to the community.
            </Typography>
          </div>
        )}
        <Typography className="warning">
          Write something appropriate! everybody will see it.
        </Typography>
      </div>
      {moderationError && (
        <Typography style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>
          {moderationError}
        </Typography>
      )}
      <Form onSubmit={handleSubmit}>
        <br />
        <div className="input-container">
          <TextField
            required
            className="string-input"
            label="title"
            autoFocus
            inputProps={{ maxLength: 90 }}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <br />
        <div className="input-container">
          <TextField
            className="string-input description"
            label="description"
            required
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <br />
        <div className="input-container content">
          <TextField
            required
            multiline
            rowsMax={10}
            type="text"
            name="body"
            label="content"
            value={formData.body}
            onChange={handleChange}
            id="outlined-multiline-static"
            rows={4}
            variant="filled"
          />
        </div>

        <div className="buttons">
          <Button type="submit" disabled={loading} variant="contained" color="primary">
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            className="cancel"
            to="/insights"
            component={Link}
            variant="contained"
            color="secondary">
            Cancel
          </Button>
        </div>
      </Form>
    </Div>
  );
}
