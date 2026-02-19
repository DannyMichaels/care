import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactMarkdown from 'react-markdown';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '@care/shared';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
  },
  content: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    lineHeight: 1.7,
    '& h1': { fontSize: '1.6rem', marginBottom: theme.spacing(2) },
    '& h2': { fontSize: '1.2rem', marginTop: theme.spacing(2), marginBottom: theme.spacing(1) },
    '& h3': { fontSize: '1rem', marginTop: theme.spacing(1.5), marginBottom: theme.spacing(0.5) },
    '& p': { marginBottom: theme.spacing(1.5) },
    '& ul, & ol': { paddingLeft: theme.spacing(3), marginBottom: theme.spacing(1.5) },
    '& li': { marginBottom: theme.spacing(0.5) },
    '& a': { color: theme.palette.primary.main },
  },
}));

export default function LegalModal({ open, onClose, type }) {
  const classes = useStyles();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const content = isPrivacy ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle disableTypography className={classes.title}>
        <span style={{ fontSize: '18px', fontWeight: 600 }}>{title}</span>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
