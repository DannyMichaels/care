import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '4% auto',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '90vw',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '90vw',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '900px',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '1000px',
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: '60vw',
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(17),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordion: {
    marginTop: 20,
    marginBottom: 30,
    '& .MuiAccordionSummary-content': {
      alignItems: 'center',
    },
  },
  contentContainer: {
    width: '100%',
  },
  summaryActions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: 4,
  },
  actionIcon: {
    padding: 6,
  },
}));
export { useStyles };
