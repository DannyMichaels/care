import Layout from "../../../layouts/Layout/Layout";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Moment from "react-moment";
import "moment-timezone";

// Context
import { useContext, useState, useEffect } from "react";
import { useStateValue } from "../../../context/CurrentUserContext";
import { ThemeStateContext } from "../../../context/ThemeStateContext";
import {
  AllUsersDispatchContext,
  AllUsersStateContext,
} from "../../../context/AllUsersContext";

// Services and Utils
import { getAge } from '@care/shared';
import {
  isPushSupported,
  getPermissionState,
  subscribeToPush,
  unsubscribeFromPush,
  registerServiceWorker,
} from '../../../utils/pushNotifications';
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../../../components/Helpers/ScrollToTopOnMount";

// Views
import UserEdit from "../../../components/Dialogs/UserDialogs/UserEdit";
import UserDelete from "../../../components/Modals/UserDelete";

// Components and Icons
import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SecurityIcon from "@material-ui/icons/Security";
import DescriptionIcon from "@material-ui/icons/Description";

// Styles
import { useStyles } from "./settingStyles";

export default function Settings() {
  const [{ currentUser }, dispatch] = useStateValue();
  const [themeState, setThemeState] = useContext(ThemeStateContext);
  const [openEdit, setOpenEdit] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushDenied, setPushDenied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { allUsers } = useContext(AllUsersStateContext);
  const dispatchAllUsers = useContext(AllUsersDispatchContext);

  const handleOpen = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const classes = useStyles();

  // useState assigns a default value for a variable, an annonymous function is used to set the default value,
  // we have to use an annonymous funciton because the initial value is decided based on the logic for lines 63-68
  const [switchState, setSwitchState] = useState(() => {
    let state = localStorage.getItem("switchState");
    if (state !== null) {
      return state === "true" ? true : false;
    }
    return false;
  });

  useEffect(() => {
    const checkPush = async () => {
      if (!isPushSupported()) return;
      setPushSupported(true);
      setPushDenied(getPermissionState() === 'denied');
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setPushEnabled(!!subscription);
      } catch {
        // SW not registered yet
      }
    };
    checkPush();
  }, []);

  const handlePushToggle = async () => {
    if (pushEnabled) {
      await unsubscribeFromPush();
      setPushEnabled(false);
    } else {
      try {
        await registerServiceWorker();
        await subscribeToPush();
        setPushEnabled(true);
        setPushDenied(getPermissionState() === 'denied');
      } catch (err) {
        console.error('Push subscribe failed:', err);
        setPushDenied(getPermissionState() === 'denied');
        if (getPermissionState() === 'denied') {
          setToastMsg('Notifications blocked — check browser settings');
        } else if (err?.message?.includes('push service')) {
          setToastMsg('Push service unavailable — enable Google push messaging in browser settings');
        } else {
          setToastMsg('Failed to enable push notifications');
        }
      }
    }
  };

  useEffect(() => {
    // if people are exploiting with application window.
    let existingPreference = localStorage.getItem("themeState");
    if (existingPreference) {
      existingPreference.match(/^light$/i)
        ? setSwitchState(false)
        : setSwitchState(true);
    } else {
      setSwitchState(false);
      localStorage.setItem("switchState", "false");
    }
  }, []);

  const handleThemeChange = () => {
    setSwitchState(switchState === true ? false : true);

    if (themeState === "light") {
      setThemeState("dark");
      localStorage.setItem("themeState", "dark");
      localStorage.setItem("switchState", true);
    } else {
      setThemeState("light");
      localStorage.setItem("themeState", "light");
      localStorage.setItem("switchState", false);
    }
  };

  // have to do this instead of using "currentUser" in order to avoid a bug
  // where the date changes to current time when updating the user.
  const userDate = allUsers.find((user) => user?.id === Number(currentUser?.id))
    ?.created_at;

  return (
    <Layout title="Settings">
      <ScrollToTopOnMount />
      <div className={classes.userContainer}>
        <Typography className={classes.accountTitle}>Your Account</Typography>
        {currentUser?.image && (
          <img
            className={classes.userImage}
            src={currentUser?.image}
            alt={currentUser?.name}
          />
        )}
        <Typography className={classes.userText}>
          <strong>Name:</strong>&nbsp;{currentUser?.name}
        </Typography>
        <Typography className="birthday">
          <strong>Date of Birth:</strong>&nbsp;
          <Moment format="MM/DD/YY">{currentUser?.birthday}</Moment>
        </Typography>
        <Typography className="birthday">
          <strong>Age:</strong>&nbsp;
          {getAge(currentUser?.birthday)} years old
        </Typography>
        <Typography className={classes.userText}>
          <strong>Gender:</strong>&nbsp;{currentUser?.gender}
        </Typography>
        <Typography className={classes.userText}>
          <strong>Email:</strong>&nbsp;{currentUser?.email}
        </Typography>
        <Typography>
          <strong>Joined:</strong>&nbsp;
          <Moment format="dddd, MMMM Do yyyy">{userDate}</Moment>
        </Typography>
      </div>

      <Button
        className={classes.manage}
        onClick={handleOpen}
        variant="contained"
        color="primary"
      >
        Edit Account
      </Button>
      <Button
        className={classes.manage}
        onClick={() => setIsDeleteOpen((prevState) => !prevState)}
        variant="contained"
        color="primary"
      >
        Delete Account
      </Button>
      <hr />
      <br />
      <div className={classes.root}>
        <Typography className={classes.categories}>Preferences</Typography>
        <div className="card-actions">
          <Card className={classes.card}>
            <CardActions className={classes.actionsContainer}>
              <Typography className={classes.themeStateContainer}>
                <Brightness4Icon className={classes.themeStateIcon} />
                &nbsp;Dark mode
              </Typography>
              <Switch
                className={classes.themeStateSwitch}
                checked={switchState}
                onChange={handleThemeChange}
              />
            </CardActions>
          </Card>
          {pushSupported && (
            <Card className={classes.card}>
              <CardActions className={classes.actionsContainer}>
                <Typography className={classes.themeStateContainer}>
                  <NotificationsIcon className={classes.themeStateIcon} />
                  &nbsp;Push Notifications
                </Typography>
                <Switch
                  className={classes.themeStateSwitch}
                  checked={pushEnabled}
                  onChange={handlePushToggle}
                  disabled={pushDenied}
                />
              </CardActions>
            </Card>
          )}
        </div>
      </div>
      <div className={classes.root}>
        <Typography className={classes.categories}>Legal</Typography>
        <div className="card-actions">
          <Card className={classes.card}>
            <CardActions className={classes.actionsContainer}>
              <Link to="/privacy" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography className={classes.themeStateContainer}>
                  <SecurityIcon className={classes.themeStateIcon} />
                  &nbsp;Privacy Policy
                </Typography>
              </Link>
            </CardActions>
          </Card>
          <Card className={classes.card}>
            <CardActions className={classes.actionsContainer}>
              <Link to="/terms" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography className={classes.themeStateContainer}>
                  <DescriptionIcon className={classes.themeStateIcon} />
                  &nbsp;Terms of Service
                </Typography>
              </Link>
            </CardActions>
          </Card>
        </div>
      </div>
      {openEdit && (
        <UserEdit
          allUsers={allUsers}
          currentUser={currentUser}
          handleOpen={handleOpen}
          handleClose={handleClose}
          dispatchCurrentUser={dispatch}
          dispatchAllUsers={dispatchAllUsers}
          setOpenEdit={setOpenEdit}
        />
      )}
      {isDeleteOpen && (
        <UserDelete
          currentUser={currentUser}
          openDelete={isDeleteOpen}
          setOpenDelete={setIsDeleteOpen}
          dispatchAllUsers={dispatchAllUsers}
          dispatchCurrentUser={dispatch}
        />
      )}
      <Snackbar
        open={!!toastMsg}
        autoHideDuration={5000}
        onClose={() => setToastMsg('')}
        message={toastMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}
