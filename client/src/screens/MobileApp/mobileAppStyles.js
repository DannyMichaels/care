import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1a1a1a 0%, #2e2e2e 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 2),
    color: '#fff',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(8),
    maxWidth: 900,
    width: '100%',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(4),
    },
  },
  phoneContainer: {
    flexShrink: 0,
  },
  phone: {
    width: 240,
    height: 490,
    background: '#111',
    borderRadius: 32,
    border: '2px solid #333',
    padding: 8,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    [theme.breakpoints.down('xs')]: {
      width: 200,
      height: 410,
      borderRadius: 28,
    },
  },
  screen: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    objectFit: 'cover',
    objectPosition: 'top',
  },
  textSection: {
    maxWidth: 420,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  logoImage: {
    width: 64,
    height: 64,
    objectFit: 'contain'
  },
  appName: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 42,
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  tagline: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 20,
    color: '#fff',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 14,
    color: '#999',
    marginBottom: theme.spacing(3),
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: `0 0 ${theme.spacing(3)}px 0`,
  },
  featureItem: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 15,
    color: '#ccc',
    padding: `${theme.spacing(0.75)}px 0`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
    '&::before': {
      content: '""',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: theme.palette.primary.main,
      flexShrink: 0,
    },
  },
  storeButtons: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  storeBadge: {
    height: 48,
    transition: 'transform 200ms ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  backLink: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: 14,
    color: theme.palette.primary.main,
    textDecoration: 'none',
    marginTop: theme.spacing(3),
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export { useStyles };
