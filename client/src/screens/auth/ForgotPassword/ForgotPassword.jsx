import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { sendVerificationCode } from '@care/shared';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import EmailIcon from '@material-ui/icons/Email';
import Logo from '../../../components/Logo/Logo.jsx';
import { useStyles } from './forgotPasswordStyles';

export default function ForgotPassword() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');

    setError('');
    setLoading(true);
    try {
      await sendVerificationCode(email.toLowerCase());
      history.push(`/reset-password?email=${encodeURIComponent(email.toLowerCase())}`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.logoContainer}>
        <Typography className={classes.title}>Care</Typography>
        <Logo className={classes.logo} />
      </div>

      <Typography className={classes.subtitle}>
        Enter your email and we'll send you a code to reset your password.
      </Typography>

      {error && <Typography className={classes.error}>{error}</Typography>}

      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          <EmailIcon />
          <FormControl>
            <InputLabel className={classes.label} htmlFor="email">
              Email Address
            </InputLabel>
            <Input
              id="email"
              type="text"
              className={classes.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </div>
        <br />
        <Button
          type="submit"
          className={classes.button}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Code'}
        </Button>
      </form>

      <Typography className={classes.loginLink}>
        Remember your password?&nbsp;
        <Link className={classes.link} to="/login">Login</Link>
      </Typography>
    </div>
  );
}
