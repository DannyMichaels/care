import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: theme.spacing(4, 2),
    textAlign: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 28,
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 16,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    maxWidth: 400,
  },
  emailButton: {
    textTransform: 'none',
    fontSize: 16,
    padding: theme.spacing(1.5, 4),
  },
  emailText: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  backLink: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 14,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    marginTop: theme.spacing(4),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export { useStyles };
