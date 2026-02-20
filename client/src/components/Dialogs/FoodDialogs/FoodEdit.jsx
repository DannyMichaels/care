import React, { useState, useEffect } from "react";
import useFormData from "../../../hooks/useFormData";
import Button from "@material-ui/core/Button";
import { Link, useHistory, useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import NativeSelect from "@material-ui/core/NativeSelect";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from "../../Form/DialogComponents";
import { Box } from "@material-ui/core";
import { foodIcon, foodName } from "../../../utils/foodUtils";
import { toDateTimeLocal } from '@care/shared';

export default function FoodEdit({ setOpenEdit, onSave, foods }) {
  const history = useHistory("/");
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, handleChange } = useFormData({
    name: "",
    time: "",
    rating: "",
    factors: "",
  });
  const { name, rating, factors } = formData;
  const { id } = useParams();

  useEffect(() => {
    const prefillFormData = () => {
      const oneFood = foods?.find((food) => {
        return food?.id === Number(id);
      });
      if (oneFood?.name === undefined) {
        history.push("/");
      } else {
        const { name, time, rating, factors } = oneFood;
        setFormData({ name, time, rating, factors });
      }
    };
    if (foods?.length) {
      prefillFormData();
    }
  }, [foods, id, history]);

  return (
    <>
      <Dialog onClose={() => setOpenEdit(false)} open={() => setOpenEdit(true)}>
        <DialogTitle onClose={() => setOpenEdit(false)}>
          <Typography className="title">Edit Food</Typography>
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
                autoFocus
                inputProps={{ maxLength: 15 }}
                type="text"
                name="name"
                label="Food name"
                style={{ width: "300px", margin: "10px" }}
                value={name}
                onChange={handleChange}
                id="outlined-multiline-static"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <Box role="img" aria-label={formData.name} mt={2}>
                      {foodIcon(formData.name)}
                    </Box>
                  ),
                }}
              />
            </div>

            <div className="input-container">
              <TextField
                name="time"
                required
                id="datetime-local"
                label={
                  name ? `When did you eat ${name}?` : `When did you eat this?`
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

            <div className="rating-input-container">
              <FormHelperText>
                On a scale of 1 to 5,
                <br /> how much did you enjoy&nbsp;
                {name ? foodName(name) : "it"}?
              </FormHelperText>
              <NativeSelect
                required
                label="rating"
                value={rating}
                onChange={handleChange}
                inputProps={{
                  name: "rating",
                  id: "rating-native-simple",
                }}
              >
                <option value={1}>⭐ </option>
                <option value={2}>⭐ ⭐ </option>
                <option value={3}>⭐ ⭐ ⭐ </option>
                <option value={4}>⭐ ⭐ ⭐ ⭐ </option>
                <option value={5}>⭐ ⭐ ⭐ ⭐ ⭐ </option>
              </NativeSelect>
            </div>

            <div className="input-container">
              <TextField
                inputProps={{ maxLength: 131 }}
                name="factors"
                required
                id="factor-input"
                label="What were the leading factors?"
                type="text"
                style={{ width: "300px", margin: "10px" }}
                value={factors}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
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
    </>
  );
}
