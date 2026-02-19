import { useState, useRef, useContext, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { verifyCode, sendVerificationCode, verifyUser } from '@care/shared';
import { useStateValue } from '../../../context/CurrentUserContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Logo from '../../../components/Logo/Logo.jsx';
import CodeInput from '../../../components/CodeInput/CodeInput';
import { useStyles } from './emailVerificationStyles';

export default function EmailVerification() {
  const [{ currentUser }, dispatch] = useStateValue();
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRef = useRef();
  const classes = useStyles();

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      return setError('Please enter the full 6-digit code');
    }

    setError('');
    setLoading(true);
    try {
      await verifyCode(email, fullCode);
      setSuccess('Email verified! Redirecting...');
      if (currentUser) {
        dispatch({ type: 'SET_USER', currentUser: { ...currentUser, email_verified: true } });
        setTimeout(() => history.push('/'), 1500);
      } else {
        const user = await verifyUser();
        dispatch({ type: 'SET_USER', currentUser: user });
        history.push('/');
      }
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

  useEffect(() => {
    if (currentUser?.email_verified) {
      history.push('/');
    }
  }, [currentUser, history]);

  return (
    <div className={classes.root}>
      <div className={classes.logoContainer}>
        <Typography className={classes.title}>Care</Typography>
        <Logo className={classes.logo} />
      </div>

      <Typography className={classes.subtitle}>
        Enter the 6-digit code sent to {email}
      </Typography>

      <CodeInput
        ref={codeRef}
        value={code}
        onChange={setCode}
      />

      {error && <Typography className={classes.error}>{error}</Typography>}
      {success && <Typography className={classes.success}>{success}</Typography>}

      <Button
        className={classes.button}
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>

      <Button className={classes.resendLink} onClick={handleResend}>
        Resend Code
      </Button>

      <Typography className={classes.loginLink}>
        Already verified?&nbsp;
        <Link className={classes.link} to="/login">Login</Link>
      </Typography>
    </div>
  );
}
