import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../context/CurrentUserContext';

export default function AdminRoute({ component: Component, ...rest }) {
  const [{ currentUser }] = useStateValue();
  const token = localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!token) return <Redirect to="/login" />;
        if (!currentUser?.is_admin) return <Redirect to="/" />;
        return <Component {...props} />;
      }}
    />
  );
}
