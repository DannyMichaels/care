import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Context
import { useStateValue } from '../../../context/CurrentUserContext';

// Services and Utilities
import { loginUser } from '@care/shared';

// Components
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgressLoading from '../../../components/Loading/LinearProgressLoading.jsx';

// Icons
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

// Styles
import { useStyles } from './loginStyles.js';
import Logo from '../../../components/Logo/Logo.jsx';

export default function Login() {
  const [{ currentUser }, dispatch] = useStateValue();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (loginData) => {
    try {
      setIsLoading(true);
      loginData.email = loginData?.email?.toLowerCase();
      const userData = await loginUser(loginData);

      dispatch({
        type: 'SET_USER',
        currentUser: userData,
      });

      setIsLoading(false);
      history.push('/');
    } catch (error) {
      setIsLoading(false);
      setError(error.response);
    }
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <LinearProgressLoading />;
  }

  return (
    <>
      <div className={classes.root}>
        <div className={classes.logoContainer}>
          <Typography className={classes.title}>Care</Typography>
          <Logo className={classes.logo} />
        </div>
        {error && (
          <Typography className={classes.user} style={{ color: 'red' }}>
            {error.data?.message ?? error?.statusText}
          </Typography>
        )}
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(formData);
          }}
        >
          <TextField
            label="Email Address"
            name="email"
            type="text"
            value={formData.email}
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
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
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
          <Button type="submit" className={classes.loginButton}>
            Login
          </Button>
        </form>
        <Typography className={classes.register}>
          Don't have an account? &nbsp;
          <Link className={classes.registerLink} to="/register">
            Register
          </Link>
        </Typography>
        <Typography className={classes.register} style={{ fontSize: '16px', marginTop: '8px' }}>
          <Link className={classes.registerLink} to="/forgot-password">
            Forgot your password?
          </Link>
        </Typography>
        <Typography className={classes.register} style={{ fontSize: '14px', marginTop: '12px' }}>
          <Link className={classes.registerLink} to="/privacy">
            Privacy Policy
          </Link>
          &nbsp;|&nbsp;
          <Link className={classes.registerLink} to="/terms">
            Terms of Service
          </Link>
        </Typography>
        <Typography className={classes.register} style={{ fontSize: '14px', marginTop: '12px' }}>
          <Link className={classes.registerLink} to="/mobile">
            Try the mobile app
          </Link>
        </Typography>
        <br />
        <Typography className={classes.user}>
          <br />
          <a
            className={classes.link}
            target="_blank"
            rel="noreferrer"
            href="https://daniel-michael.com"
          >
            Daniel Michael &copy; {new Date().getFullYear()}
          </a>
        </Typography>
      </div>
    </>
  );
}
