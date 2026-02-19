import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { GOOGLE_PLAY_URL, APP_STORE_URL } from '@care/shared';
import { useStyles } from './mobileAppStyles';

export default function MobileApp() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.phoneContainer}>
          <div className={classes.phone}>
            <img
              className={classes.screen}
              src="/care-screenshot.jpg"
              alt="Care app home screen"
            />
          </div>
        </div>

        <div className={classes.textSection}>
          <div className={classes.logoRow}>
            <img className={classes.logoImage} src="/carelogo-3d.png" alt="Care" />
            <Typography className={classes.appName}>Care</Typography>
          </div>

          <Typography className={classes.tagline}>
            Your personal wellness companion
          </Typography>
          <Typography className={classes.subtitle}>
            Everything you track on the web — now in your pocket.
          </Typography>

          <ul className={classes.featureList}>
            <li className={classes.featureItem}>Track your mood & symptoms</li>
            <li className={classes.featureItem}>Log food & manage medications</li>
            <li className={classes.featureItem}>Write daily affirmations</li>
            <li className={classes.featureItem}>Share insights with the community</li>
          </ul>

          <div className={classes.storeButtons}>
            <a href={GOOGLE_PLAY_URL} target="_blank" rel="noreferrer">
              <img
                className={classes.storeBadge}
                src="/google-play-badge.svg"
                alt="Get it on Google Play"
              />
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer">
              <img
                className={classes.storeBadge}
                src="/app-store-badge.svg"
                alt="Download on the App Store"
              />
            </a>
          </div>
        </div>
      </div>

      <Link className={classes.backLink} to="/login">
        &larr; Back to login
      </Link>
    </div>
  );
}
