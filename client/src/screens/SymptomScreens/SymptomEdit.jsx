import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const Div = styled.div`
  padding: "20px";
  margin: auto 40px;
`;
const Form = styled.form`
  padding: "20px";
`;

export default function InsightUpdate({ handleUpdate, symptoms }) {
  const [formData, setFormData] = useState({
    name: "",
    time: "",
  });
  const { name, time } = formData;
  const { id } = useParams();

  useEffect(() => {
    const prefillFormData = () => {
      const oneSymptom = symptoms.find((symptom) => {
        return symptom.id === Number(id);
      });
      const { name, time } = oneSymptom;
      setFormData({ name, time });
    };
    if (symptoms.length) {
      prefillFormData();
    }
  }, [symptoms, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Div>
      <div className="title-container">
        <Typography className="title">Edit Symptom</Typography>
      </div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(id, formData);
        }}
      >
        <br />
        <div className="input-container">
          <TextField
            required
            label="symptom"
            className="string-input title"
            autoFocus
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <br />
        <div className="input-container">
          <TextField
            required
            className="string-input description"
            type="datetime-local"
            name="time"
            value={time}
            onChange={handleChange}
          />
        </div>
        <br />

        <div className="buttons">
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button
            className="cancel"
            to="/"
            component={Link}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Div>
  );
}