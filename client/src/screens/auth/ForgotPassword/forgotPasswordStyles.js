import { yellow } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
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
    color: ({ themeState }) => themeState === 'dark' && yellow[700],
  },
  logo: {
    width: '100%',
    maxHeight: '80px',
    objectFit: 'cover',
    filter: ({ themeState }) =>
      themeState === 'dark' ? 'drop-shadow(0 0 2px #fff)' : 'none',
  },
  subtitle: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '24px',
    color: ({ themeState }) => themeState === 'dark' && '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    color: ({ themeState }) => (themeState === 'light' ? 'black' : 'white'),
  },
  inputField: {
    color: ({ themeState }) => (themeState === 'light' ? 'black' : 'white'),
    marginBottom: '20px',
    width: '300px',
    marginLeft: '10px',
  },
  label: {
    color: ({ themeState }) => (themeState === 'light' ? '#000' : '#fff'),
    marginLeft: '10px',
  },
  button: {
    margin: '8px auto',
    padding: '12px 40px',
    color: ({ themeState }) => (themeState === 'light' ? '#62B5D9' : yellow[700]),
    fontSize: '18px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '8px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
  },
  loginLink: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '16px',
    marginTop: '16px',
    color: ({ themeState }) => themeState === 'dark' && '#fff',
  },
  link: {
    textDecoration: 'none',
    color: ({ themeState }) => (themeState === 'light' ? '#62B5D9' : yellow[700]),
  },
});

export { useStyles };
