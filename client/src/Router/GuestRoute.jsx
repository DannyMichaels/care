import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../context/CurrentUserContext';

export default function GuestRoute({ component: Component, ...rest }) {
  const [{ currentUser }] = useStateValue();
  const token = localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      render={(props) => {
        if (token && currentUser && currentUser.email_verified) {
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
