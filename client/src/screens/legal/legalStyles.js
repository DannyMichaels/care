import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 720,
    margin: '0 auto',
    padding: theme.spacing(4, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  backLink: {
    display: 'inline-block',
    marginBottom: theme.spacing(2),
    textDecoration: 'none',
    color: theme.palette.primary.main,
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  content: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    lineHeight: 1.7,
    '& h1': {
      fontSize: '2rem',
      marginBottom: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.type === 'light' ? '#ddd' : '#555'}`,
      paddingBottom: theme.spacing(1),
    },
    '& h2': {
      fontSize: '1.4rem',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    '& h3': {
      fontSize: '1.1rem',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    '& p': {
      marginBottom: theme.spacing(1.5),
    },
    '& ul, & ol': {
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(1.5),
    },
    '& li': {
      marginBottom: theme.spacing(0.5),
    },
    '& a': {
      color: theme.palette.primary.main,
    },
    '& strong': {
      fontWeight: 600,
    },
  },
}));

export { useStyles };
