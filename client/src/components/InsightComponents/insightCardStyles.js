import { yellow, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  likeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  likedInsight: {
    color: theme.palette.type === 'dark' ? yellow[700] : red[500],
    cursor: 'pointer',
  },
  unLikedInsight: {
    cursor: 'pointer',
  },
}));

export { useStyles };
