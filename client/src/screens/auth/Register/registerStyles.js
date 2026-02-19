import { yellow, blue } from '@material-ui/core/colors';
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
    flexDirection: 'row',
    padding: '20px',
    marginBottom: (props) => (props.currentUser ? '-10px' : '0'),
    alignItems: 'center',
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
  registerButton: {
    padding: '20px',
    color: theme.palette.primary.main,
    fontSize: '28px',
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    textTransform: 'capitalize',
  },
  user: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '15px',
    textDecoration: 'none',
    marginBottom: (props) => (props.currentUser ? '5px' : '20px'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  label: {
    color: theme.palette.text.primary,
    marginLeft: '10px',
  },
  login: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    fontSize: '26px',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    textAlign: 'center',
  },
  loginLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  inputField: {
    color: theme.palette.text.primary,
    marginBottom: '20px',
    width: '300px',
    marginLeft: '10px',
  },
  birthdayField: {
    color: theme.palette.text.primary,
    marginBottom: '20px',
    width: '300px',
    marginLeft: '0',
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
  passwordLabel: {
    color: theme.palette.text.primary,
  },
  alert: {
    color: 'red',
    textAlign: 'center',
  },
  middleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    height: '40px',
    width: '40px',
    borderRadius: '40px',
    objectFit: 'cover',
    border: `1px solid ${theme.palette.text.primary}`,
  },
  bigIcon: {
    height: '100px',
    width: '100px',
    alignSelf: 'center',
    marginBottom: '5px',
    border: (props) =>
      props.imagePreview ? `1px solid ${theme.palette.text.primary}` : undefined,
    borderRadius: (props) => props.imagePreview && '50%',
  },
  bigUserImage: {
    height: '100px',
    width: '100px',
    alignSelf: 'center',
    marginBottom: '5px',
    border: `1px solid ${theme.palette.text.primary}`,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  cameraIcon: {
    cursor: 'pointer',
    color: ({ imagePreview }) => {
      if (theme.palette.type === 'light' && imagePreview) {
        return '#000';
      } else if (theme.palette.type === 'dark' && !imagePreview) {
        return yellow[700];
      } else if (theme.palette.type === 'dark' && imagePreview) {
        return '#fff';
      } else {
        return blue[500];
      }
    },
  },
  visibility: {
    color: theme.palette.text.primary,
  },
  passwordIcon: {
    marginRight: '-10px',
  },
  genderContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  pictureButtons: {
    display: 'flex',
    justifyContent: 'center',
    position: ({ imagePreview }) => !imagePreview && 'absolute',
    right: ({ imagePreview }) => !imagePreview && 0,
    bottom: ({ imagePreview }) => !imagePreview && '-8px',
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
