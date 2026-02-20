import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Context
import { useStateValue } from '../../../context/CurrentUserContext';
import {
  AllUsersDispatchContext,
} from '../../../context/AllUsersContext';

// Services and Utils
import { toTitleCase, registerUser, checkPasswordLength } from '@care/shared';
import moment from 'moment';

// Components
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgressLoading from '../../../components/Loading/LinearProgressLoading.jsx';

// Icons
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClearIcon from '@material-ui/icons/Clear';
import EventIcon from '@material-ui/icons/Event';
import CameraIcon from '@material-ui/icons/CameraAlt';

// Styles
import { useStyles } from './registerStyles';
import Logo from '../../../components/Logo/Logo.jsx';
import LegalModal from '../../legal/LegalModal';

export default function Register() {
  const [{ currentUser }, dispatch] = useStateValue();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);
  const [passwordConfirmAlert, setPasswordConfirmAlert] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const dispatchAllUsers = useContext(AllUsersDispatchContext);

  const history = useHistory();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (registerData) => {
    try {
      setIsLoading(true);
      registerData.email = registerData?.email?.toLowerCase();
      const userData = await registerUser(registerData);
      dispatch({ type: 'SET_USER', currentUser: userData });

      dispatchAllUsers({ type: 'USER_CREATED', payload: userData });

      // Verification code is sent automatically by the backend on registration
      setIsLoading(false);
      history.push(`/verify-email?email=${encodeURIComponent(registerData.email)}`);
    } catch (error) {
      setIsLoading(false);
      setError(error.response);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthday: '',
    gender: '',
    image: '',
  });
  const { name, email, password, birthday, gender, image } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkPasswordLength(password, setPasswordAlert);
    if (password !== passwordConfirm) {
      return setPasswordConfirmAlert(true);
    } else {
      setPasswordConfirmAlert(false);
    }
    handleRegister(formData);
  };

  const onImageSelected = (e) => {
    const img = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      setFormData((prevState) => ({
        ...prevState,
        image: fileReader.result,
      }));
      setImagePreview(true);
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

  const handleImageClear = () => {
    setFormData((prevState) => ({
      ...prevState,
      image: '',
    }));
    document.getElementById('image-upload').value = '';

    setImagePreview(false);
  };

  const classes = useStyles({ imagePreview });

  if (isLoading) {
    return <LinearProgressLoading />;
  }

  return (
    <>
      <div className={classes.root}>
        <div className={classes.middleWrapper}>
          <div className={classes.logoContainer}>
            <Typography className={classes.title}>Care</Typography>
            <Logo className={classes.logo} />
          </div>
          {error && (
            <Typography className={classes.user} style={{ color: 'red' }}>
              {error.data?.message ?? error?.statusText}
            </Typography>
          )}

          <div className={classes.imageContainer}>
            {imagePreview ? (
              <img
                className={classes.bigUserImage}
                src={image}
                alt={currentUser?.name}
              />
            ) : (
              <AccountCircleIcon className={classes.bigIcon} />
            )}
            <footer className={classes.pictureButtons}>
              {imagePreview && (
                <IconButton
                  onMouseDown={(e) => e.preventDefault()}
                  className={classes.clearIcon}
                  onClick={handleImageClear}
                >
                  <ClearIcon className={classes.clearIcon} />
                </IconButton>
              )}
              <IconButton
                onMouseDown={(e) => e.preventDefault()}
                className={classes.iconButton}
                onClick={selectImage}
              >
                <CameraIcon className={classes.cameraIcon} />
              </IconButton>
            </footer>
          </div>
          <br />
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              required
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
                    {!imagePreview ? (
                      <AccountCircleIcon />
                    ) : (
                      <img className={classes.userImage} src={image} alt={name} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
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
            <TextField
              required
              label="Password"
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
                        <Visibility className={classes.visibility} />
                      ) : (
                        <VisibilityOff className={classes.visibility} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordAlert && (
              <>
                <div className={classes.alert}>
                  <p>Password has to be 8 characters at minimum</p>
                </div>
                <br />
              </>
            )}
            <TextField
              required
              label="Confirm Password"
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
                        <Visibility className={classes.visibility} />
                      ) : (
                        <VisibilityOff className={classes.visibility} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {passwordConfirmAlert && (
              <>
                <div className={classes.alert}>
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
              className={classes.field}
              name="birthday"
              InputProps={{
                inputProps: { max: moment().format('YYYY-MM-DD') },
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon />
                  </InputAdornment>
                ),
              }}
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
              required
              label="Gender"
              name="gender"
              value={toTitleCase(gender)}
              onChange={handleChange}
              className={classes.field}
              SelectProps={{ native: true }}
            >
              <option value="" disabled hidden>
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </TextField>
            <div className={classes.genderContainer} style={{ marginTop: '8px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography style={{ fontSize: '14px' }}>
                    I agree to the{' '}
                    <span
                      className={classes.loginLink}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.preventDefault(); setLegalModal('terms'); }}
                    >
                      Terms of Service
                    </span>
                    {' '}and{' '}
                    <span
                      className={classes.loginLink}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.preventDefault(); setLegalModal('privacy'); }}
                    >
                      Privacy Policy
                    </span>
                  </Typography>
                }
              />
            </div>
            <Button
              type="submit"
              disabled={!agreedToTerms}
              className={classes.registerButton}
            >
              Register
            </Button>
          </form>
          <Typography className={classes.login}>
            Already have an account? &nbsp;
            <Link className={classes.loginLink} to="/login">
              Login
            </Link>
          </Typography>
          <Typography
            className={classes.login}
            style={{ fontSize: '14px', marginTop: '12px' }}
          >
            <span
              className={classes.loginLink}
              style={{ cursor: 'pointer' }}
              onClick={() => setLegalModal('privacy')}
            >
              Privacy Policy
            </span>
            &nbsp;|&nbsp;
            <span
              className={classes.loginLink}
              style={{ cursor: 'pointer' }}
              onClick={() => setLegalModal('terms')}
            >
              Terms of Service
            </span>
          </Typography>
          <Typography
            className={classes.login}
            style={{ fontSize: '14px', marginTop: '12px' }}
          >
            <Link className={classes.loginLink} to="/mobile">
              Try the mobile app
            </Link>
          </Typography>
          <br />
          <Typography className={classes.user}>
            <a
              className={classes.link}
              target="_blank"
              rel="noreferrer"
              href="http://www.github.com/dannymichaels/care"
            >
              Daniel Michael &copy; 2020
            </a>
          </Typography>
        </div>
      </div>
      <LegalModal
        open={!!legalModal}
        onClose={() => setLegalModal(null)}
        type={legalModal}
      />
    </>
  );
}
