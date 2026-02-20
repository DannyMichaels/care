import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import InputAdornment from '@material-ui/core/InputAdornment';

import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../Form/DialogComponents';
import { useFormStyles } from '../../Form/formStyles';
import Form from './StyledUserEdit';

// Icons
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CameraIcon from '@material-ui/icons/CameraAlt';
import ClearIcon from '@material-ui/icons/Clear';

// Services and Utils
import { getOneUser, putUser, toTitleCase, checkEmailUniqueuess, checkEmailValidity, checkPasswordLength } from '@care/shared';


export default function UserEdit({
  handleOpen,
  handleClose,
  currentUser,
  allUsers,
  dispatchCurrentUser,
  dispatchAllUsers,
  setOpenEdit,
}) {
  const classes = useFormStyles();
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    email: '',
    gender: '',
    password: '',
    image: '',
  });
  const { name, birthday, gender, email, password, image } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmAlert, setPasswordConfirmAlert] = useState(false);
  const [emailUniquenessAlert, setEmailUniquenessAlert] = useState(false);
  const [emailValidityAlert, setEmailValidityAlert] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [allConditionsAreNotMet, setAllConditionsAreNotMet] = useState(true);

  const handleImageClear = () => {
    setFormData((prevState) => ({
      ...prevState,
      image: '',
    }));
    document.getElementById('image-upload').value = '';
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onImageSelected = (e) => {
    const img = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      setFormData((prevState) => ({
        ...prevState,
        image: fileReader.result,
      }));
    });
    if (img) {
      if (img.type?.includes('image')) {
        return fileReader.readAsDataURL(img);
      } else {
        document.getElementById('image-upload').value = '';
        return alert(
          `${img.type
            .split('/')
            .pop()} file types aren't allowed! \nplease upload an image file.`
        );
      }
    }
  };

  const selectImage = () => {
    document.getElementById('image-upload').click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleValidity = () => {
    if (password) {
      checkPasswordLength(password, setPasswordAlert);
      setPasswordConfirmAlert(password !== passwordConfirm);
    } else {
      setPasswordAlert(false);
      setPasswordConfirmAlert(false);
    }
    checkEmailValidity(email, setEmailValidityAlert);
    checkEmailUniqueuess(allUsers, email, setEmailUniquenessAlert, currentUser);

    const passwordValid = !password || (!passwordAlert && password === passwordConfirm);
    if (!emailValidityAlert && !emailUniquenessAlert && passwordValid && name) {
      setAllConditionsAreNotMet(false);
    } else {
      setAllConditionsAreNotMet(true);
    }
  };

  useEffect(() => {
    handleValidity();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allUsers,
    currentUser,
    email,
    password,
    passwordConfirm,
    emailValidityAlert,
    emailUniquenessAlert,
    passwordAlert,
    name,
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?.id) {
        const oneUser = await getOneUser(currentUser.id);
        setFormData(oneUser);
        return () => {
          setFormData(oneUser);
        };
      }
    };
    fetchUser();
  }, [currentUser]);

  const handleUpdate = async (id, userData) => {
    userData.email = userData?.email?.toLowerCase();
    const updatedUser = await putUser(id, userData);

    dispatchCurrentUser({ type: 'EDIT_USER', currentUser: updatedUser });
    await dispatchAllUsers({ type: 'USER_UPDATED', payload: userData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidity();
    if (password) checkPasswordLength(password, setPasswordAlert);
    const { password: pw, ...rest } = formData;
    const submitData = pw ? formData : rest;
    await handleUpdate(currentUser.id, submitData);
    setOpenEdit(false);
  };

  return (
    <Dialog onClose={handleClose} open={handleOpen}>
      <DialogTitle onClose={handleClose}>
        <Typography className="title">Edit Account</Typography>
      </DialogTitle>

      <Form image={image} onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="user-image-container">
            {image ? (
              <img
                className="big-user-image"
                src={image}
                alt={currentUser?.name}
              />
            ) : (
              <AccountCircleIcon className="big-icon" />
            )}
            <footer className="picture-buttons">
              <IconButton
                onMouseDown={(e) => e.preventDefault()}
                className="icon-button clear"
                onClick={handleImageClear}
              >
                <ClearIcon className="big-camera-icon" />
              </IconButton>
              <IconButton
                onMouseDown={(e) => e.preventDefault()}
                className="icon-button"
                onClick={selectImage}
              >
                <CameraIcon className="big-camera-icon" />
              </IconButton>
            </footer>
          </div>

          <TextField
            label="Name"
            name="name"
            type="text"
            inputProps={{ maxLength: 20 }}
            value={name}
            onChange={handleChange}
            className={classes.field}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {!image ? (
                    <AccountCircleIcon />
                  ) : (
                    <img className="user-image" src={image} alt="invalid url" />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email Address"
            name="email"
            type="text"
            value={email}
            onChange={handleChange}
            className={classes.field}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          {emailValidityAlert && (
            <>
              <div className="alert">
                <p>Please enter a valid email address</p>
              </div>
              <br />
            </>
          )}
          {emailUniquenessAlert && (
            <>
              <div className="alert">
                <p>This email address already exists!</p>
              </div>
              <br />
            </>
          )}
          <TextField
            label="New Password (optional)"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            className={classes.field}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <Visibility className="visibility" />
                    ) : (
                      <VisibilityOff className="visibility" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordAlert && (
            <>
              <div className="alert">
                <p>Password has to be 8 characters at minimum</p>
              </div>
              <br />
            </>
          )}
          <TextField
            label="Confirm New Password"
            name="passwordConfirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={classes.field}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPasswordConfirm ? (
                      <Visibility className="visibility" />
                    ) : (
                      <VisibilityOff className="visibility" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordConfirmAlert && (
            <>
              <div className="alert">
                <p>Password and password confirmation do not match!</p>
              </div>
              <br />
            </>
          )}

          <TextField
            id="date"
            required
            label="Date of Birth"
            type="date"
            name="birthday"
            className={classes.field}
            InputLabelProps={{
              shrink: true,
            }}
            value={birthday}
            onChange={handleChange}
          />
          <input
            type="file"
            id="image-upload"
            style={{ visibility: 'hidden' }}
            onChange={onImageSelected}
          />
          <TextField
            select
            label="Gender"
            name="gender"
            value={toTitleCase(gender)}
            onChange={handleChange}
            className={classes.field}
            SelectProps={{ native: true }}
          >
            <option value="" disabled hidden>
              Select a gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Transgender">Transgender</option>
            <option value="Non-binray">Non-Binary</option>
            <option value="Other">Other</option>
          </TextField>
          <br />
          <DialogActions>
            <Button
              disabled={allConditionsAreNotMet}
              type="submit"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button
              to="/settings"
              component={Link}
              onClick={handleClose}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
