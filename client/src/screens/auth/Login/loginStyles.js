import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexFlow: 'nowrap',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '20px',
    marginBottom: (props) => (props.currentUser ? '-10px' : '20px'),
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loginButton: {
    margin: '20px auto',
    padding: '20px',
    color: theme.palette.primary.main,
    fontSize: '28px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    textTransform: 'capitalize',
  },
  register: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '26px',
    textDecoration: 'none',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  user: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '15px',
    textDecoration: 'none',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  registerLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  inputField: {
    color: theme.palette.text.primary,
    marginBottom: '20px',
    width: '300px',
    marginLeft: '10px',
  },
  passwordField: {
    color: theme.palette.text.primary,
    marginBottom: '20px',
    width: '300px',
  },
  lockIcon: {
    marginRight: '10px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
  },
  label: {
    color: theme.palette.text.primary,
    marginLeft: '10px',
  },
  passwordLabel: {
    color: theme.palette.text.primary,
  },
  userLoggedImage: {
    height: '130px',
    width: '130px',
    alignSelf: 'center',
    marginBottom: '5px',
    marginTop: '20px',
    border: `1px solid ${theme.palette.text.primary}`,
    borderRadius: '50%',
  },
  visibility: {
    color: theme.palette.text.primary,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 250ms ease-in-out',
    '&:hover': {
      transition: 'transform 250ms ease-in-out',
      cursor: 'pointer',
      transform: 'scale(1.005)',
    },
  },
}));
export { useStyles };
