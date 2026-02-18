import React, { useState, useEffect, useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { indigo } from '@material-ui/core/colors';
import { ThemeStateContext } from '../../context/ThemeStateContext';
import { isPushSupported, getPermissionState, subscribeToPush, registerServiceWorker } from '../../utils/pushNotifications';

const DISMISSED_KEY = 'notificationBannerDismissed';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    boxShadow: ({ themeState }) =>
      themeState === 'light' ? 'default' : `0px 0px 4px 1.2px ${indigo[50]}`,
    background: ({ themeState }) => themeState === 'light' && '#fff',
    border: ({ themeState }) => themeState === 'light' && '1px solid #DBDBDB',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '12px 16px',
    '&:last-child': { paddingBottom: '12px' },
  },
  icon: {
    marginRight: '12px',
    color: indigo[400],
  },
  text: {
    flex: 1,
    fontSize: '0.9rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '8px',
    gap: '4px',
  },
}));

export default function NotificationBanner() {
  const [themeState] = useContext(ThemeStateContext);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const classes = useStyles({ themeState });

  useEffect(() => {
    if (!isPushSupported()) return;
    if (getPermissionState() !== 'default') return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    setVisible(true);
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      await registerServiceWorker();
      await subscribeToPush();
      setVisible(false);
    } catch (err) {
      console.error('Push subscribe failed:', err);
      if (err?.message?.includes('push service')) {
        setToastMsg('Push service unavailable — enable Google push messaging in browser settings');
      } else if (err?.message?.includes('permission')) {
        setToastMsg('Notifications blocked — check browser settings');
      } else {
        setToastMsg('Failed to enable push notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  };

  if (!visible && !toastMsg) return null;

  return (
    <>
    <Snackbar
      open={!!toastMsg}
      autoHideDuration={5000}
      onClose={() => setToastMsg('')}
      message={toastMsg}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
    {visible && (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <NotificationsIcon className={classes.icon} />
          <Typography className={classes.text}>
            Enable notifications for medication reminders
          </Typography>
        </CardContent>
        <div className={classes.actions}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={handleEnable}
            disabled={loading}
          >
            Enable
          </Button>
          <IconButton size="small" onClick={handleDismiss}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </Card>
    )}
    </>
  );
}
