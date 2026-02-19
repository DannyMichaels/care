import React from 'react';
import { useStyles } from './linearLoadingStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Logo from '../Logo';

function LinearProgressLoading() {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <div className={classes.loadingWrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.loadingLogoDiv}>
            <Logo className={classes.logo} />
          </div>
          <LinearProgress style={{ width: '50vw' }} />
        </div>
      </div>
    </Paper>
  );
}

export default LinearProgressLoading;
