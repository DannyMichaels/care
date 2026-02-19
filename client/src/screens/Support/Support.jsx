import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import { SUPPORT_EMAIL } from '@care/shared';
import { useStyles } from './supportStyles';

export default function Support() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.logo} src="/carelogo-3d.png" alt="Care" />
      <Typography className={classes.title}>Contact Support</Typography>
      <Typography className={classes.subtitle}>
        Have a question, found a bug, or need help with your account? We'd love to hear from you.
      </Typography>
      <Button
        className={classes.emailButton}
        variant="contained"
        color="primary"
        startIcon={<EmailIcon />}
        href={`mailto:${SUPPORT_EMAIL}`}
      >
        Email Us
      </Button>
      <Typography className={classes.emailText}>
        {SUPPORT_EMAIL}
      </Typography>
      <Link className={classes.backLink} to="/login">
        &larr; Back
      </Link>
    </div>
  );
}
