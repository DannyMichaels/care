import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '20px',
    marginBottom: '20px',
  },
  title: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '36px',
    padding: '15px',
    marginTop: '10px',
    textShadow: '0.5px 4px 10px #999',
    color: theme.palette.type === 'dark' ? theme.palette.primary.main : undefined,
  },
  logo: {
    width: '100%',
    maxHeight: '80px',
    objectFit: 'cover',
    filter: theme.palette.type === 'dark' ? 'drop-shadow(0 0 2px #fff)' : 'none',
  },
  subtitle: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '24px',
    color: theme.palette.text.primary,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    marginBottom: '12px',
  },
  passwordField: {
    color: theme.palette.text.primary,
    width: '300px',
  },
  passwordLabel: {
    color: theme.palette.text.primary,
  },
  lockIcon: {
    marginRight: '10px',
  },
  visibility: {
    color: theme.palette.text.primary,
  },
  button: {
    margin: '8px auto',
    padding: '12px 40px',
    color: theme.palette.primary.main,
    fontSize: '18px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    textTransform: 'capitalize',
  },
  resendLink: {
    marginTop: '8px',
    color: theme.palette.primary.main,
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '8px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '8px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
  },
  loginLink: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '16px',
    marginTop: '16px',
    color: theme.palette.text.primary,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

export { useStyles };
