import { makeStyles } from '@material-ui/core/styles';

const useFormStyles = makeStyles((theme) => ({
  field: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& .MuiFilledInput-root': {
      borderRadius: 8,
    },
  },
  fieldRow: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2.5),
  },
}));

export { useFormStyles };
