import { useState, useEffect } from "react";
import useFormData from "../../../hooks/useFormData";
import { useParams, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import MDEditor from "@uiw/react-md-editor";
import { Div, Form } from "./styledInsightEdit";

export default function InsightEdit({ handleUpdate, insights, moderationError }) {
  const theme = useTheme();
  const { formData, setFormData, handleChange } = useFormData({
    title: "",
    description: "",
    body: "",
  });
  const { title, description, body } = formData;
  const { id } = useParams();

  const { goBack } = useHistory();

  useEffect(() => {
    const prefillFormData = () => {
      const oneInsight = insights.find((insight) => {
        return insight.id === Number(id);
      });
      const { title, description, body } = oneInsight;
      setFormData({ title, description, body });
    };
    if (insights.length) {
      prefillFormData();
    }
  }, [insights, id]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleUpdate(id, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      <div className="title-container">
        <Typography className="title">Edit Insight</Typography>
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
            label="title"
            inputProps={{ maxLength: 50 }}
            className="string-input title"
            autoFocus
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <br />
        <div className="input-container">
          <TextField
            label="description"
            required
            className="string-input description"
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
          />
        </div>
        <br />
        <div className="input-container content" data-color-mode={theme.palette.type}>
          <MDEditor
            value={body}
            onChange={(val) => setFormData((prev) => ({ ...prev, body: val || '' }))}
            preview="edit"
            height={200}
          />
        </div>
        <div className="buttons">
          <Button type="submit" disabled={loading} variant="contained" color="primary">
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            onClick={() => goBack()}
            className="cancel"
            variant="contained"
            color="secondary">
            Cancel
          </Button>
        </div>
      </Form>
    </Div>
  );
}
