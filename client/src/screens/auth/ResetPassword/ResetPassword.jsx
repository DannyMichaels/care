import { useState, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { resetPassword, sendVerificationCode } from '@care/shared';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';
import Logo from '../../../components/Logo/Logo.jsx';
import CodeInput from '../../../components/CodeInput/CodeInput';
import { useStyles } from './resetPasswordStyles';

export default function ResetPassword() {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRef = useRef();
  const classes = useStyles();

  const handleReset = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      return setError('Please enter the full 6-digit code');
    }
    if (newPassword.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(email, fullCode, newPassword);
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => history.push('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendVerificationCode(email);
      setCode(['', '', '', '', '', '']);
      setSuccess('Code resent!');
      setError('');
      codeRef.current?.focus();
    } catch {
      setError('Failed to resend code');
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.logoContainer}>
        <Typography className={classes.title}>Care</Typography>
        <Logo className={classes.logo} />
      </div>

      <Typography className={classes.subtitle}>
        Enter the code sent to {email} and your new password
      </Typography>

      <CodeInput
        ref={codeRef}
        value={code}
        onChange={setCode}
      />

      <div className={classes.inputContainer}>
        <LockIcon className={classes.lockIcon} />
        <FormControl>
          <InputLabel className={classes.passwordLabel} htmlFor="newPassword">
            New Password
          </InputLabel>
          <Input
            className={classes.passwordField}
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? (
                    <Visibility className={classes.visibility} />
                  ) : (
                    <VisibilityOff className={classes.visibility} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <div className={classes.inputContainer}>
        <LockIcon className={classes.lockIcon} />
        <FormControl>
          <InputLabel className={classes.passwordLabel} htmlFor="confirmPassword">
            Confirm Password
          </InputLabel>
          <Input
            className={classes.passwordField}
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
      </div>

      {error && <Typography className={classes.error}>{error}</Typography>}
      {success && <Typography className={classes.success}>{success}</Typography>}

      <Button
        className={classes.button}
        onClick={handleReset}
        disabled={loading}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>

      <Button className={classes.resendLink} onClick={handleResend}>
        Resend Code
      </Button>

      <Typography className={classes.loginLink}>
        Remember your password?&nbsp;
        <Link className={classes.link} to="/login">Login</Link>
      </Typography>
    </div>
  );
}
