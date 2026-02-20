import React from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  glass: {
    background: theme.custom.glass.background,
    backdropFilter: theme.custom.glass.backdropFilter,
    WebkitBackdropFilter: theme.custom.glass.backdropFilter,
    border: theme.custom.glass.border,
    boxShadow: theme.custom.glass.boxShadow,
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.custom.glass.hoverShadow,
      border: theme.custom.glass.hoverBorder,
    },
  },
}));

export default function GlassCard({ children, className, onClick, style }) {
  const classes = useStyles();

  return (
    <Card
      className={`${classes.glass}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      style={style}
      elevation={0}
    >
      {children}
    </Card>
  );
}
